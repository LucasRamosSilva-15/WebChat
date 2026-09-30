// Testes de integração: salas
const request = require('supertest');
const { app } = require('../server');
const { resetDb, closeDb, createUser, createRoom, createMessage, tokenFor, adminToken, authHeader } = require('./helpers');

let owner, other, ownerAuth, otherAuth;

beforeEach(async () => {
  await resetDb();
  owner = await createUser({ displayName: 'Dono' });
  other = await createUser({ displayName: 'Outro' });
  ownerAuth = authHeader(tokenFor(owner.id));
  otherAuth = authHeader(tokenFor(other.id));
});
afterAll(closeDb);

describe('Salas', () => {
  it('exige autenticação', async () => {
    expect((await request(app).get('/api/rooms')).status).toBe(401);
    expect((await request(app).post('/api/rooms').send({ name: 'x' })).status).toBe(401);
  });

  it('POST /api/rooms cria sala com o usuário logado como criador', async () => {
    const res = await request(app).post('/api/rooms').set(ownerAuth).send({ name: 'Geral' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Geral', type: 'public', created_by: owner.id });
  });

  it('POST /api/rooms retorna 400 sem nome', async () => {
    const res = await request(app).post('/api/rooms').set(ownerAuth).send({ name: '   ' });
    expect(res.status).toBe(400);
  });

  it('GET /api/rooms lista as salas com o criador', async () => {
    await createRoom(owner.id, { name: 'A' });
    await createRoom(other.id, { name: 'B' });

    const res = await request(app).get('/api/rooms').set(ownerAuth);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].creator).toBeDefined();
  });

  it('GET /api/rooms/:id retorna a sala, ou 404 se não existir', async () => {
    const room = await createRoom(owner.id);
    const ok = await request(app).get(`/api/rooms/${room.id}`).set(ownerAuth);
    expect(ok.status).toBe(200);
    expect(ok.body.id).toBe(room.id);

    const missing = await request(app).get('/api/rooms/00000000-0000-4000-8000-000000000000').set(ownerAuth);
    expect(missing.status).toBe(404);
  });

  it('DELETE /api/rooms/:id: o criador pode apagar (e as mensagens vão junto)', async () => {
    const room = await createRoom(owner.id);
    await createMessage(room.id, owner.id);

    const res = await request(app).delete(`/api/rooms/${room.id}`).set(ownerAuth);
    expect(res.status).toBe(200);

    const { Room, Message } = require('../src/models');
    expect(await Room.count()).toBe(0);
    expect(await Message.count()).toBe(0);
  });

  it('DELETE /api/rooms/:id: outro usuário recebe 403', async () => {
    const room = await createRoom(owner.id);
    const res = await request(app).delete(`/api/rooms/${room.id}`).set(otherAuth);
    expect(res.status).toBe(403);
  });

  it('DELETE /api/admin/rooms/:id: admin apaga sala de qualquer usuário', async () => {
    const room = await createRoom(owner.id);
    const res = await request(app).delete(`/api/admin/rooms/${room.id}`).set(authHeader(adminToken()));
    expect(res.status).toBe(200);
  });

  it('GET /api/admin/rooms exige admin', async () => {
    expect((await request(app).get('/api/admin/rooms').set(ownerAuth)).status).toBe(403);
    expect((await request(app).get('/api/admin/rooms').set(authHeader(adminToken()))).status).toBe(200);
  });
});
