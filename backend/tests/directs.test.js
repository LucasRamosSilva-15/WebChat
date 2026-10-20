const request = require('supertest');
const { app } = require('../server');
const { resetDb, closeDb, createUser, tokenFor, authHeader } = require('./helpers');
const { DirectMessage } = require('../src/models');

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
    expect(listForB.body.messages).toHaveLength(1);
    expect(listForB.body.messages[0].text).toBe('Ola Bob tudo bem?');
    expect(listForB.body.messages[0].isMe).toBe(false);
    expect(listForB.body.messages[0].created_at).toBeDefined();
    expect(listForB.body.hasMore).toBe(false);
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

describe('Paginação do histórico de mensagens diretas (cursor)', () => {
  let convId;

  const seedDirects = async (count) => {
    const base = new Date('2026-02-01T00:00:00.000Z').getTime();
    for (let i = 1; i <= count; i++) {
      await DirectMessage.create({
        conversation_id: convId,
        sender_id: i % 2 === 0 ? userA.id : userB.id,
        content: `dm ${i}`,
        created_at: new Date(base + i * 60000)
      });
    }
  };
  const getPage = (query = '', auth = authA) =>
    request(app).get(`/api/directs/conversations/${convId}/messages${query}`).set(auth);

  beforeEach(async () => {
    const res = await request(app).post('/api/directs/conversations').set(authA).send({ targetUserId: userB.id });
    convId = res.body.id;
  });

  it('devolve as mensagens mais recentes em ordem cronológica com metadados de cursor', async () => {
    await seedDirects(6);
    const res = await getPage('?limit=4');

    expect(res.status).toBe(200);
    expect(res.body.messages.map(m => m.text)).toEqual(['dm 3', 'dm 4', 'dm 5', 'dm 6']);
    expect(res.body.hasMore).toBe(true);
    expect(new Date(res.body.nextCursor).getTime()).toBe(new Date(res.body.messages[0].created_at).getTime());
  });

  it('carrega o bloco anterior com before e chega ao início do histórico', async () => {
    await seedDirects(6);
    const page1 = await getPage('?limit=4');
    const page2 = await getPage(`?limit=4&before=${encodeURIComponent(page1.body.nextCursor)}`);

    expect(page2.status).toBe(200);
    expect(page2.body.messages.map(m => m.text)).toEqual(['dm 1', 'dm 2']);
    expect(page2.body.hasMore).toBe(false);
    expect(page2.body.nextCursor).toBeNull();
  });

  it('mantém isMe correto em cada página e respeita o teto de 100', async () => {
    await seedDirects(3);
    const res = await getPage('?limit=99999');
    expect(res.body.messages.map(m => m.isMe)).toEqual([false, true, false]); // visão da Alice (A)
    expect(res.body.messages.length).toBeLessThanOrEqual(100);
  });

  it('bloqueia quem não participa da conversa (403)', async () => {
    const intruso = await createUser({ displayName: 'Intruso' });
    const res = await getPage('?limit=2', authHeader(tokenFor(intruso.id)));
    expect(res.status).toBe(403);
  });
});
