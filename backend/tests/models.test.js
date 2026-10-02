// Testes unitários dos Models (Sequelize + SQLite em memória)
const { User, Room, Message, Report, Feedback } = require('../src/models');
const { resetDb, closeDb, createUser, createRoom, createMessage } = require('./helpers');

beforeEach(resetDb);
afterAll(closeDb);

describe('Models', () => {
  describe('User', () => {
    it('salva um usuário com id UUID e created_at automáticos', async () => {
      const user = await createUser({ email: 'a@a.com' });
      expect(user.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(user.created_at).toBeInstanceOf(Date);
      expect((await User.findByPk(user.id)).email).toBe('a@a.com');
    });

    it('rejeita usuário sem e-mail', async () => {
      await expect(User.create({ password: 'x' })).rejects.toThrow();
    });

    it('rejeita e-mail duplicado (unique)', async () => {
      await createUser({ email: 'dup@a.com' });
      await expect(createUser({ email: 'dup@a.com' })).rejects.toThrow();
    });
  });

  describe('Room', () => {
    it('usa type "public" por padrão e associa o criador', async () => {
      const user = await createUser();
      const room = await createRoom(user.id);
      expect(room.type).toBe('public');

      const found = await Room.findByPk(room.id, { include: { model: User, as: 'creator' } });
      expect(found.creator.id).toBe(user.id);
    });

    it('rejeita sala sem nome', async () => {
      await expect(Room.create({})).rejects.toThrow();
    });
  });

  describe('Message', () => {
    it('salva mensagem ligada a sala e usuário', async () => {
      const user = await createUser();
      const room = await createRoom(user.id);
      await createMessage(room.id, user.id, { content: 'oi' });

      const msgs = await room.getMessages();
      expect(msgs).toHaveLength(1);
      expect(msgs[0].content).toBe('oi');
    });

    it('permite mensagens sem texto desde que criadas', async () => {
      const user = await createUser();
      const room = await createRoom(user.id);
      const msg = await Message.create({ room_id: room.id, user_id: user.id });
      expect(msg.id).toBeDefined();
    });

    it('apaga as mensagens em cascata quando a sala é apagada', async () => {
      const user = await createUser();
      const room = await createRoom(user.id);
      await createMessage(room.id, user.id);

      await room.destroy();
      expect(await Message.count()).toBe(0);
    });
  });

  describe('Report', () => {
    it('salva denúncia com status "pending" por padrão', async () => {
      const user = await createUser();
      const room = await createRoom(user.id);
      const msg = await createMessage(room.id, user.id);

      const report = await Report.create({ message_id: msg.id, user_id: user.id, reason: 'spam' });
      expect(report.status).toBe('pending');
    });
  });

  describe('Feedback', () => {
    it('guarda a lista de imagens e usa status "pending"', async () => {
      const user = await createUser();
      const fb = await Feedback.create({
        user_id: user.id,
        comment: 'ótimo app',
        images: ['a.png', 'b.png']
      });

      const found = await Feedback.findByPk(fb.id);
      expect(found.status).toBe('pending');
      expect(found.images).toEqual(['a.png', 'b.png']);
    });

    it('rejeita feedback sem comentário', async () => {
      const user = await createUser();
      await expect(Feedback.create({ user_id: user.id })).rejects.toThrow();
    });
  });
});
