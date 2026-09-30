// Testes de integração: rotas de usuário/autenticação (Controller -> Service -> Repository -> SQLite)
const request = require('supertest');
const { app } = require('../server');
const { resetDb, closeDb, createUser, tokenFor, adminToken, authHeader } = require('./helpers');

beforeEach(resetDb);
afterAll(closeDb);

const newUser = { name: 'Wssi', email: 'wssi@test.com', password: 'senha123' };

describe('POST /api/auth/register', () => {
  it('cria o usuário, devolve token e não expõe a senha', async () => {
    const res = await request(app).post('/api/auth/register').send(newUser);

    expect(res.status).toBe(201);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toMatchObject({ email: 'wssi@test.com', name: 'Wssi' });
    expect(res.body.user.password).toBeUndefined();
  });

  it('guarda a senha com hash (nunca em texto puro)', async () => {
    await request(app).post('/api/auth/register').send(newUser);
    const { User } = require('../src/models');
    const saved = await User.findOne({ where: { email: newUser.email } });
    expect(saved.password).not.toBe(newUser.password);
  });

  it('retorna 400 se faltar e-mail ou senha', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'x' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/obrigat/i);
  });

  it('retorna 409 se o e-mail já existe', async () => {
    await request(app).post('/api/auth/register').send(newUser);
    const res = await request(app).post('/api/auth/register').send(newUser);
    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(() => request(app).post('/api/auth/register').send(newUser));

  it('autentica com credenciais corretas', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: newUser.email, password: newUser.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.email).toBe(newUser.email);
  });

  it('retorna 401 com senha errada', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: newUser.email, password: 'errada' });
    expect(res.status).toBe(401);
  });

  it('retorna 401 com e-mail inexistente', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nao@existe.com', password: 'x' });
    expect(res.status).toBe(401);
  });

  it('retorna 400 sem e-mail/senha', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('o token gerado no login funciona em rotas protegidas (/auth/me)', async () => {
    const login = await request(app).post('/api/auth/login').send({ email: newUser.email, password: newUser.password });
    const me = await request(app).get('/api/auth/me').set(authHeader(login.body.token));
    expect(me.status).toBe(200);
    expect(me.body.email).toBe(newUser.email);
    expect(me.body.password).toBeUndefined();
  });
});

describe('GET /api/auth/me', () => {
  it('retorna 401 sem token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('retorna 404 se o usuário do token não existe mais', async () => {
    const res = await request(app).get('/api/auth/me').set(authHeader(tokenFor('00000000-0000-4000-8000-000000000000')));
    expect(res.status).toBe(404);
  });
});

describe('Admin', () => {
  it('POST /api/admin/auth retorna 401 com senha errada e 400 sem senha', async () => {
    process.env.ADMIN_SECRET_KEY = 'segredo-admin';
    expect((await request(app).post('/api/admin/auth').send({ password: 'x' })).status).toBe(401);
    expect((await request(app).post('/api/admin/auth').send({})).status).toBe(400);
  });

  it('POST /api/admin/auth devolve token com a senha correta', async () => {
    process.env.ADMIN_SECRET_KEY = 'segredo-admin';
    const res = await request(app).post('/api/admin/auth').send({ password: 'segredo-admin' });
    expect(res.status).toBe(200);
    expect(res.body.role).toBe('admin');
  });

  it('GET /api/admin/users exige admin e lista usuários sem senha', async () => {
    await createUser({ email: 'u1@test.com' });

    const semToken = await request(app).get('/api/admin/users');
    expect(semToken.status).toBe(401);

    const comoUsuario = await request(app).get('/api/admin/users').set(authHeader(tokenFor('qualquer')));
    expect(comoUsuario.status).toBe(403);

    const res = await request(app).get('/api/admin/users').set(authHeader(adminToken()));
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].password).toBeUndefined();
  });
});
