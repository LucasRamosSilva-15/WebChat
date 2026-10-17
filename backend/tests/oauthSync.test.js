const request = require('supertest');
const { app } = require('../server');
const sequelize = require('../src/config/database');
const { User } = require('../src/models');

describe('OAuth Synchronization Tests (/auth/oauth-sync)', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('1. Deve falhar com 400 se o e-mail não for fornecido', async () => {
    const res = await request(app)
      .post('/api/auth/oauth-sync')
      .send({ name: 'Google User' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/e-mail/i);
  });

  it('2. Deve registrar um novo usuário via OAuth herdando name, avatar_url e email', async () => {
    const payload = {
      email: 'oauth.google@example.com',
      name: 'Google User Test',
      avatar_url: 'https://lh3.googleusercontent.com/a/photo.jpg'
    };

    const res = await request(app)
      .post('/api/auth/oauth-sync')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(payload.email);
    expect(res.body.user.name).toBe(payload.name);
    expect(res.body.user.profilePhoto).toBe(payload.avatar_url);

    const userInDb = await User.findOne({ where: { email: payload.email } });
    expect(userInDb).not.toBeNull();
    expect(userInDb.displayName).toBe(payload.name);
    expect(userInDb.profilePhoto).toBe(payload.avatar_url);
    expect(userInDb.password).toBeNull();
  });

  it('3. Deve sincronizar e autenticar usuário existente atualizando foto/nome se ausentes', async () => {
    const payload = {
      email: 'oauth.google@example.com',
      name: 'Google User Test Updated',
      avatar_url: 'https://lh3.googleusercontent.com/a/new-photo.jpg'
    };

    const res = await request(app)
      .post('/api/auth/oauth-sync')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(payload.email);
  });

  it('4. Deve responder ao preflight (OPTIONS) com os headers CORS apropriados para a Vercel', async () => {
    const res = await request(app)
      .options('/api/auth/oauth-sync')
      .set('Origin', 'https://web-chat-project-web2.vercel.app')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type, Authorization');

    expect([200, 204]).toContain(res.status);
    expect(res.headers['access-control-allow-origin']).toBe('https://web-chat-project-web2.vercel.app');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('5. Deve incluir headers CORS no POST originado pela Vercel', async () => {
    const res = await request(app)
      .post('/api/auth/oauth-sync')
      .set('Origin', 'https://web-chat-project-web2.vercel.app')
      .send({ email: 'oauth.google@example.com' });

    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('https://web-chat-project-web2.vercel.app');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });
});
