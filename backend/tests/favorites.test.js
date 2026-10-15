const request = require('supertest');
const { app } = require('../server');
const { resetDb, closeDb, createUser, createRoom, tokenFor, authHeader } = require('./helpers');

let user, userAuth;

beforeEach(async () => {
  await resetDb();
  user = await createUser({ displayName: 'Lucas' });
  userAuth = authHeader(tokenFor(user.id));
});
afterAll(closeDb);

describe('Favoritos API', () => {
  it('exige autenticacao para acessar favoritos', async () => {
    expect((await request(app).get('/api/favorites')).status).toBe(401);
    expect((await request(app).post('/api/favorites').send({ item_type: 'room', item_id: '123' })).status).toBe(401);
  });

  it('adiciona e lista sala favorita com sucesso', async () => {
    const room = await createRoom(user.id, { name: 'Geral', description: 'Canal geral' });

    const addRes = await request(app)
      .post('/api/favorites')
      .set(userAuth)
      .send({
        item_type: 'room',
        item_id: room.id,
        title: 'Geral',
        content: 'Canal geral'
      });

    expect(addRes.status).toBe(201);
    expect(addRes.body.item_id).toBe(String(room.id));

    const listRes = await request(app)
      .get('/api/favorites')
      .set(userAuth);

    expect(listRes.status).toBe(200);
    expect(listRes.body.rooms).toHaveLength(1);
    expect(listRes.body.rooms[0].name).toBe('Geral');
    expect(listRes.body.rooms[0].roomId).toBe(String(room.id));
  });

  it('adiciona e remove mensagem favorita com sucesso', async () => {
    const addRes = await request(app)
      .post('/api/favorites')
      .set(userAuth)
      .send({
        item_type: 'message',
        item_id: 'msg-999',
        title: 'Carlos',
        content: 'Anotacao importante',
        meta: { time: '14:30', roomName: 'Desenvolvimento' }
      });

    expect(addRes.status).toBe(201);

    const listRes = await request(app)
      .get('/api/favorites')
      .set(userAuth);

    expect(listRes.status).toBe(200);
    expect(listRes.body.messages).toHaveLength(1);
    expect(listRes.body.messages[0].text).toBe('Anotacao importante');
    expect(listRes.body.messages[0].sender).toBe('Carlos');

    const delRes = await request(app)
      .delete('/api/favorites/message/msg-999')
      .set(userAuth);

    expect(delRes.status).toBe(200);

    const listAfterDel = await request(app)
      .get('/api/favorites')
      .set(userAuth);

    expect(listAfterDel.body.messages).toHaveLength(0);
  });
});
