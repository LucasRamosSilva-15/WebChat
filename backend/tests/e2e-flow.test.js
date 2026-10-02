const request = require('supertest');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const ioClient = require('socket.io-client');
const { sequelize } = require('../src/models/index');

const app = express();
app.use(express.json());
const apiRoutes = require('../src/routes/api');
app.use('/api', apiRoutes);

const server = http.createServer(app);
const io = new Server(server);

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Erro de Autenticação: Token não fornecido'));
  next();
});

io.on('connection', (socket) => {
  socket.on("join_room", ({ room }) => {
    socket.join(room);
  });
  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });
});

let testServer;
let port;
let socketUrl;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  testServer = server.listen(0);
  port = testServer.address().port;
  socketUrl = `http://localhost:${port}`;
});

afterAll(async () => {
  testServer.close();
  await sequelize.close();
});

describe('E2E User Flow', () => {
  let userToken;
  let roomId;
  let clientSocket;

  it('1. Deve registrar um usuário', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test E2E',
        email: 'teste2e@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    userToken = res.body.token;
  });

  it('2. Deve fazer login no usuário criado', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'teste2e@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    userToken = res.body.token;
  });

  it('3. Deve criar uma sala de bate-papo', async () => {
    const res = await request(app)
      .post('/api/rooms')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Sala E2E',
        description: 'Sala de teste E2E',
        capacity: 10
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    roomId = res.body.id;
  });

  it('4. Deve conectar ao WebSocket, entrar na sala e enviar mensagens (texto e imagem)', (done) => {
    clientSocket = ioClient(socketUrl, {
      auth: { token: userToken }
    });

    clientSocket.on('connect', () => {
      clientSocket.emit('join_room', { room: roomId, userId: 'test_user_id' });

      clientSocket.emit('send_message', {
        room: roomId,
        sender: 'Test E2E',
        text: 'Olá mundo!',
        time: new Date().toISOString()
      });

      clientSocket.emit('send_message', {
        room: roomId,
        sender: 'Test E2E',
        text: '',
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        time: new Date().toISOString()
      });
    });

    let messagesReceived = 0;
    clientSocket.on('receive_message', (data) => {
      messagesReceived++;
      if (messagesReceived === 1) {
        expect(data.text).toBe('Olá mundo!');
      } else if (messagesReceived === 2) {
        expect(data.image).toContain('data:image/png');
        clientSocket.disconnect();
        done();
      }
    });
  });

  it('5. Deve excluir o perfil do usuário', async () => {
    const res = await request(app)
      .delete('/api/auth/me')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Perfil excluído com sucesso.');
  });
});
