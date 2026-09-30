// Testes de integração: mensagens
const request = require('supertest');
const { app } = require('../server');
const { resetDb, closeDb, createUser, createRoom, createMessage, tokenFor, adminToken, authHeader } = require('./helpers');

let author, other, room, authorAuth, otherAuth;

beforeEach(async () => {
  await resetDb();
  author = await createUser({ displayName: 'Autor' });
  other = await createUser({ displayName: 'Outro' });
  room = await createRoom(author.id);
  authorAuth = authHeader(tokenFor(author.id));
  otherAuth = authHeader(tokenFor(other.id));
});
afterAll(closeDb);

describe('Mensagens', () => {
  it('exige autenticação', async () => {
    expect((await request(app).get(`/api/rooms/${room.id}/messages`)).status).toBe(401);
  });

  it('POST /api/rooms/:id/messages salva a mensagem com o autor do token', async () => {
    const res = await request(app).post(`/api/rooms/${room.id}/messages`).set(authorAuth).send({ content: 'Oi, pessoal!' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ content: 'Oi, pessoal!', room_id: room.id, user_id: author.id });
  });

  it('POST retorna 400 com conteúdo vazio', async () => {
    const res = await request(app).post(`/api/rooms/${room.id}/messages`).set(authorAuth).send({ content: '  ' });
    expect(res.status).toBe(400);
  });

  it('GET lista só as mensagens da sala, em ordem, com dados do autor', async () => {
    const outraSala = await createRoom(author.id, { name: 'Outra' });
    await createMessage(room.id, author.id, { content: 'primeira', created_at: new Date('2026-01-01') });
    await createMessage(room.id, other.id, { content: 'segunda', created_at: new Date('2026-01-02') });
    await createMessage(outraSala.id, author.id, { content: 'de outra sala' });

    const res = await request(app).get(`/api/rooms/${room.id}/messages`).set(authorAuth);
    expect(res.status).toBe(200);
    expect(res.body.map(m => m.content)).toEqual(['primeira', 'segunda']);
    expect(res.body[0].user.displayName).toBe('Autor');
  });

  it('DELETE /api/messages/:id: o autor pode apagar', async () => {
    const msg = await createMessage(room.id, author.id);
    const res = await request(app).delete(`/api/messages/${msg.id}`).set(authorAuth);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('DELETE /api/messages/:id: outro usuário recebe 403', async () => {
    const msg = await createMessage(room.id, author.id);
    const res = await request(app).delete(`/api/messages/${msg.id}`).set(otherAuth);
    expect(res.status).toBe(403);
  });

  it('DELETE /api/messages/:id: 404 se não existe', async () => {
    const res = await request(app).delete('/api/messages/00000000-0000-4000-8000-000000000000').set(authorAuth);
    expect(res.status).toBe(404);
  });

  it('DELETE /api/admin/messages/:id: admin apaga mensagem de qualquer um', async () => {
    const msg = await createMessage(room.id, author.id);
    const res = await request(app).delete(`/api/admin/messages/${msg.id}`).set(authHeader(adminToken()));
    expect(res.status).toBe(200);
  });
});
