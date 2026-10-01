// Testes de integração: feedbacks
const request = require('supertest');
const { app } = require('../server');
const { resetDb, closeDb, createUser, tokenFor, adminToken, authHeader } = require('./helpers');

let user, userAuth, admin;

beforeEach(async () => {
  await resetDb();
  user = await createUser();
  userAuth = authHeader(tokenFor(user.id));
  admin = authHeader(adminToken());
});
afterAll(closeDb);

describe('Feedbacks', () => {
  it('POST /api/feedbacks salva comentário e imagens', async () => {
    const res = await request(app).post('/api/feedbacks').set(userAuth).send({ comment: 'Gostei!', images: ['x.png'] });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ comment: 'Gostei!', status: 'pending', user_id: user.id });
    expect(res.body.images).toEqual(['x.png']);
  });

  it('aceita o formato antigo do frontend (reason + message)', async () => {
    const res = await request(app).post('/api/feedbacks').set(userAuth).send({ reason: 'Bug', message: 'Tela trava' });
    expect(res.status).toBe(201);
    expect(res.body.comment).toBe('Bug: Tela trava');
  });

  it('retorna 400 sem comentário e 401 sem login', async () => {
    expect((await request(app).post('/api/feedbacks').set(userAuth).send({})).status).toBe(400);
    expect((await request(app).post('/api/feedbacks').send({ comment: 'x' })).status).toBe(401);
  });

  it('admin lista, resolve e apaga feedbacks', async () => {
    const created = await request(app).post('/api/feedbacks').set(userAuth).send({ comment: 'Oi' });
    const id = created.body.id;

    const list = await request(app).get('/api/admin/feedbacks').set(admin);
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].user.email).toBe(user.email);

    const resolved = await request(app).put(`/api/admin/feedbacks/${id}`).set(admin).send({ status: 'resolved' });
    expect(resolved.body.status).toBe('resolved');

    expect((await request(app).put(`/api/admin/feedbacks/${id}`).set(admin).send({ status: 'dismissed' })).status).toBe(400);

    expect((await request(app).delete(`/api/admin/feedbacks/${id}`).set(admin)).status).toBe(200);
    expect((await request(app).delete(`/api/admin/feedbacks/${id}`).set(admin)).status).toBe(404);
  });

  it('usuário comum não acessa rotas admin de feedbacks', async () => {
    expect((await request(app).get('/api/admin/feedbacks').set(userAuth)).status).toBe(403);
  });
});
