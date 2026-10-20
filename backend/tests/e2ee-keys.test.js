// E2EE: registro e consulta de chaves públicas (o servidor nunca vê a chave privada)
const request = require('supertest');
const { app } = require('../server');
const { resetDb, closeDb, createUser, tokenFor, authHeader } = require('./helpers');
const { normalizePublicKey } = require('../src/utils/e2ee');

const X = 'f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU';
const Y = 'x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0';
const jwk = (extra = {}) => ({ kty: 'EC', crv: 'P-256', x: X, y: Y, ...extra });

describe('normalizePublicKey', () => {
  it('aceita JWK P-256 (objeto ou string) e devolve forma canônica', () => {
    const a = normalizePublicKey(jwk({ ext: true, key_ops: [] }));
    expect(JSON.parse(a)).toEqual({ crv: 'P-256', kty: 'EC', x: X, y: Y });
    expect(normalizePublicKey(JSON.stringify(jwk()))).toBe(a);
  });

  it('rejeita material de chave privada', () => {
    expect(() => normalizePublicKey(jwk({ d: 'segredo' }))).toThrow('apenas a chave pública');
  });

  it('rejeita curva/tipo errados, coordenadas inválidas e lixo', () => {
    expect(() => normalizePublicKey(jwk({ crv: 'P-384' }))).toThrow('inválida');
    expect(() => normalizePublicKey(jwk({ kty: 'RSA' }))).toThrow('inválida');
    expect(() => normalizePublicKey(jwk({ x: 'curto' }))).toThrow('inválida');
    expect(() => normalizePublicKey('{nao é json')).toThrow('inválida');
    expect(() => normalizePublicKey(null)).toThrow('inválida');
    expect(() => normalizePublicKey([1])).toThrow('inválida');
  });
});

describe('Chaves públicas E2EE (API)', () => {
  let alice, bob, authA, authB;

  beforeEach(async () => {
    await resetDb();
    alice = await createUser({ displayName: 'Alice' });
    bob = await createUser({ displayName: 'Bob' });
    authA = authHeader(tokenFor(alice.id));
    authB = authHeader(tokenFor(bob.id));
  });
  afterAll(closeDb);

  it('exige autenticação', async () => {
    expect((await request(app).put('/api/directs/keys').send({ publicKey: jwk() })).status).toBe(401);
    expect((await request(app).get(`/api/directs/keys/${alice.id}`)).status).toBe(401);
  });

  it('usuário sem chave retorna publicKey null', async () => {
    const res = await request(app).get(`/api/directs/keys/${alice.id}`).set(authB);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: alice.id, publicKey: null });
  });

  it('registra a chave e o outro usuário consegue lê-la', async () => {
    const put = await request(app).put('/api/directs/keys').set(authA).send({ publicKey: jwk() });
    expect(put.status).toBe(200);
    expect(put.body.publicKey).toEqual({ crv: 'P-256', kty: 'EC', x: X, y: Y });

    const get = await request(app).get(`/api/directs/keys/${alice.id}`).set(authB);
    expect(get.body.publicKey).toEqual({ crv: 'P-256', kty: 'EC', x: X, y: Y });
  });

  it('só altera a PRÓPRIA chave (o id vem do token)', async () => {
    await request(app).put('/api/directs/keys').set(authA).send({ publicKey: jwk(), userId: bob.id });
    expect((await request(app).get(`/api/directs/keys/${bob.id}`).set(authA)).body.publicKey).toBeNull();
  });

  it('rejeita chave privada e chave malformada com 400', async () => {
    expect((await request(app).put('/api/directs/keys').set(authA).send({ publicKey: jwk({ d: 'x' }) })).status).toBe(400);
    expect((await request(app).put('/api/directs/keys').set(authA).send({ publicKey: 'abc' })).status).toBe(400);
    expect((await request(app).put('/api/directs/keys').set(authA).send({})).status).toBe(400);
  });

  it('substituir a chave (novo dispositivo) sobrescreve a anterior', async () => {
    await request(app).put('/api/directs/keys').set(authA).send({ publicKey: jwk() });
    const novoX = 'A'.repeat(43);
    await request(app).put('/api/directs/keys').set(authA).send({ publicKey: jwk({ x: novoX }) });
    expect((await request(app).get(`/api/directs/keys/${alice.id}`).set(authB)).body.publicKey.x).toBe(novoX);
  });

  it('usuário inexistente retorna 404', async () => {
    const res = await request(app).get('/api/directs/keys/00000000-0000-4000-8000-000000000000').set(authA);
    expect(res.status).toBe(404);
  });

  it('mensagem E2EE no direct não vaza o texto para a prévia da conversa', async () => {
    const conv = await request(app).post('/api/directs/conversations').set(authA).send({ targetUserId: bob.id });
    const env = 'e2ee:v1:AAAAAAAAAAAAAAAA:Zm9vYmFy';
    const send = await request(app).post(`/api/directs/conversations/${conv.body.id}/messages`).set(authA).send({ content: env });
    expect(send.status).toBe(201);
    const list = await request(app).get('/api/directs/conversations').set(authB);
    expect(list.body[0].lastMessage).toBe('Mensagem criptografada');
  });
});
