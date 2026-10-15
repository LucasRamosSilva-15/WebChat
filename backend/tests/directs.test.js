const request = require('supertest');
const { app } = require('../server');
const { resetDb, closeDb, createUser, tokenFor, authHeader } = require('./helpers');

let userA, userB, authA, authB;

beforeEach(async () => {
  await resetDb();
  userA = await createUser({ displayName: 'Alice' });
  userB = await createUser({ displayName: 'Bob' });
  authA = authHeader(tokenFor(userA.id));
  authB = authHeader(tokenFor(userB.id));
});
afterAll(closeDb);

describe('Directs API', () => {
  it('exige autenticacao nas rotas diretas', async () => {
    expect((await request(app).get('/api/directs/conversations')).status).toBe(401);
    expect((await request(app).post('/api/directs/conversations').send({ targetUserId: userB.id })).status).toBe(401);
  });

  it('lista usuarios disponiveis para nova conversa direta', async () => {
    const res = await request(app)
      .get('/api/directs/users')
      .set(authA);

    expect(res.status).toBe(200);
    expect(res.body.some(u => u.id === userB.id)).toBe(true);
    expect(res.body.some(u => u.id === userA.id)).toBe(false);
  });

  it('cria ou recupera conversa direta entre dois usuarios', async () => {
    const createRes = await request(app)
      .post('/api/directs/conversations')
      .set(authA)
      .send({ targetUserId: userB.id });

    expect(createRes.status).toBe(200);
    expect(createRes.body.id).toBeDefined();
    expect(createRes.body.name).toBe('Bob');

    const listRes = await request(app)
      .get('/api/directs/conversations')
      .set(authB);

    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].name).toBe('Alice');
  });

  it('envia e lista mensagens em uma conversa direta', async () => {
    const createRes = await request(app)
      .post('/api/directs/conversations')
      .set(authA)
      .send({ targetUserId: userB.id });

    const convId = createRes.body.id;

    const sendRes = await request(app)
      .post(`/api/directs/conversations/${convId}/messages`)
      .set(authA)
      .send({ content: 'Ola Bob tudo bem?' });

    expect(sendRes.status).toBe(201);
    expect(sendRes.body.text).toBe('Ola Bob tudo bem?');
    expect(sendRes.body.isMe).toBe(true);

    const listForB = await request(app)
      .get(`/api/directs/conversations/${convId}/messages`)
      .set(authB);

    expect(listForB.status).toBe(200);
    expect(listForB.body).toHaveLength(1);
    expect(listForB.body[0].text).toBe('Ola Bob tudo bem?');
    expect(listForB.body[0].isMe).toBe(false);
  });

  it('exclui uma conversa direta', async () => {
    const createRes = await request(app)
      .post('/api/directs/conversations')
      .set(authA)
      .send({ targetUserId: userB.id });

    const convId = createRes.body.id;

    const delRes = await request(app)
      .delete(`/api/directs/conversations/${convId}`)
      .set(authA);

    expect(delRes.status).toBe(200);

    const listRes = await request(app)
      .get('/api/directs/conversations')
      .set(authA);

    expect(listRes.body).toHaveLength(0);
  });
});
