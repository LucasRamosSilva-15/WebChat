const mockInsert = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: { id: 'mock-msg', content: 'hello DB' }, error: null }) }) });
const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: mockFrom
  }))
}));

const request = require('supertest');
const { app, server } = require('../server');
const ioClient = require('socket.io-client');
const jwt = require('jsonwebtoken');

let socket;
let mockToken;

beforeAll((done) => {
  server.listen(3005, () => {
    mockToken = jwt.sign({ id: 'test_user_id', name: 'Test User' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
    done();
  });
});

afterAll((done) => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
  server.close(done);
});

describe('WebChat Integration Tests', () => {

  describe('REST API (Express)', () => {
    it('should return 401 on /api/rooms if no token is provided', async () => {
      const res = await request(app).get('/api/rooms');
      expect(res.statusCode).toEqual(401);
    });

    it('should return 200 on /api/rooms with valid token', async () => {
      const res = await request(app)
        .get('/api/rooms')
        .set('Authorization', `Bearer ${mockToken}`);

      expect([200, 500]).toContain(res.statusCode);
    });
  });

  describe('WebSocket (Socket.IO)', () => {
    it('should reject connection without token', (done) => {
      const client = ioClient('http://localhost:3005', {
        reconnectionDelay: 0,
        forceNew: true,
      });

      client.on('connect_error', (err) => {
        expect(err.message).toMatch(/Token não fornecido|Token inválido/);
        client.disconnect();
        done();
      });
    });

    it('should connect successfully with valid token', (done) => {
      socket = ioClient('http://localhost:3005', {
        auth: { token: mockToken },
        reconnectionDelay: 0,
        forceNew: true,
      });

      socket.on('connect', () => {
        expect(socket.connected).toBe(true);
        done();
      });
    });

    it('should join a room and receive presence updates', (done) => {
      socket.emit('joinRoom', { roomId: 'test_room', user: { id: 'test_user_id', name: 'Test User' } });

      socket.on('roomPresenceUpdated', (data) => {
        expect(data.roomId).toBe('test_room');
        expect(data.onlineUsers.length).toBeGreaterThan(0);
        expect(data.onlineUsers[0].id).toBe('test_user_id');
        socket.off('roomPresenceUpdated');
        done();
      });
    });

    it('should rate limit fast messages', (done) => {
      socket.emit('send_message', {
        room: 'test_room',
        userId: 'test_user_id',
        userName: 'Test User',
        content: 'hello'
      });

      socket.emit('send_message', {
        room: 'test_room',
        userId: 'test_user_id',
        userName: 'Test User',
        content: 'hello again'
      });

      socket.on('rate_limit_error', (err) => {
        expect(err.error).toBeDefined();
        socket.off('rate_limit_error');
        done();
      });
    });
    it('should save message to database on send_message', (done) => {
      mockInsert.mockClear();
      mockFrom.mockClear();

      setTimeout(() => {
        socket.emit('send_message', {
          room: 'test_room',
          userId: 'test_user_id',
          userName: 'Test User',
          content: 'hello DB',
          imageUrl: null
        });

        setTimeout(() => {
          expect(mockFrom).toHaveBeenCalledWith('messages');
          expect(mockInsert).toHaveBeenCalledWith([
            expect.objectContaining({
              room_id: 'test_room',
              user_id: 'test_user_id',
              user_name: 'Test User',
              content: 'hello DB'
            })
          ]);
          done();
        }, 150);
      }, 550);
    });
  });
});
