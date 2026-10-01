// Testes de integração: denúncias
const request = require('supertest');
const { app } = require('../server');
const { resetDb, closeDb, createUser, createRoom, createMessage, tokenFor, adminToken, authHeader } = require('./helpers');

let user, msg, userAuth, admin;

beforeEach(async () => {
  await resetDb();
  user = await createUser();
  const room = await createRoom(user.id);
  msg = await createMessage(room.id, user.id);
  userAuth = authHeader(tokenFor(user.id));
  admin = authHeader(adminToken());
});
afterAll(closeDb);

describe('Denúncias', () => {
  it('POST /api/reports cria denúncia pendente', async () => {
    const res = await request(app).post('/api/reports').set(userAuth).send({ message_id: msg.id, reason: 'spam' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ reason: 'spam', status: 'pending', user_id: user.id, message_id: msg.id });
  });

  it('POST /api/reports valida motivo e mensagem', async () => {
    expect((await request(app).post('/api/reports').set(userAuth).send({ message_id: msg.id })).status).toBe(400);
    expect((await request(app).post('/api/reports').set(userAuth).send({ reason: 'spam' })).status).toBe(400);
  });

  it('POST /api/reports exige login', async () => {
    expect((await request(app).post('/api/reports').send({ message_id: msg.id, reason: 'x' })).status).toBe(401);
  });

  it('admin lista, resolve e apaga denúncias', async () => {
    const created = await request(app).post('/api/reports').set(userAuth).send({ message_id: msg.id, reason: 'spam' });
    const id = created.body.id;

    const list = await request(app).get('/api/admin/reports').set(admin);
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].message.content).toBe(msg.content);

    const resolved = await request(app).put(`/api/admin/reports/${id}`).set(admin).send({ status: 'resolved' });
    expect(resolved.status).toBe(200);
    expect(resolved.body.status).toBe('resolved');

    const del = await request(app).delete(`/api/admin/reports/${id}`).set(admin);
    expect(del.status).toBe(200);
    expect((await request(app).get('/api/admin/reports').set(admin)).body).toHaveLength(0);
  });

  it('rejeita status inválido (400) e denúncia inexistente (404)', async () => {
    const created = await request(app).post('/api/reports').set(userAuth).send({ message_id: msg.id, reason: 'spam' });
    expect((await request(app).put(`/api/admin/reports/${created.body.id}`).set(admin).send({ status: 'xyz' })).status).toBe(400);
    expect((await request(app).put('/api/admin/reports/00000000-0000-4000-8000-000000000000').set(admin).send({ status: 'resolved' })).status).toBe(404);
  });

  it('usuário comum não acessa rotas admin de denúncias', async () => {
    expect((await request(app).get('/api/admin/reports').set(userAuth)).status).toBe(403);
  });
});
