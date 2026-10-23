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
    expect(res.body.messages.map(m => m.content)).toEqual(['primeira', 'segunda']);
    expect(res.body.messages[0].user.displayName).toBe('Autor');
    expect(res.body.hasMore).toBe(false);
    expect(res.body.nextCursor).toBeNull();
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

describe('Paginação do histórico de mensagens (cursor)', () => {
  const seedMessages = async (count, roomId = room.id) => {
    const base = new Date('2026-01-01T00:00:00.000Z').getTime();
    const rows = [];
    for (let i = 1; i <= count; i++) {
      rows.push(await createMessage(roomId, author.id, {
        content: `msg ${i}`,
        created_at: new Date(base + i * 60000)
      }));
    }
    return rows;
  };
  const getPage = (query = '') =>
    request(app).get(`/api/rooms/${room.id}/messages${query}`).set(authorAuth);

  it('since devolve só mensagens mais novas, em ordem cronológica, com nextSince', async () => {
    const rows = await seedMessages(7);
    const since = new Date(rows[1].created_at).toISOString();
    const res = await getPage(`?limit=3&since=${encodeURIComponent(since)}`);

    expect(res.status).toBe(200);
    expect(res.body.messages.map(m => m.content)).toEqual(['msg 3', 'msg 4', 'msg 5']);
    expect(res.body.hasMore).toBe(true);
    expect(new Date(res.body.nextSince).getTime()).toBe(new Date(res.body.messages[2].created_at).getTime());

    const next = await getPage(`?limit=3&since=${encodeURIComponent(res.body.nextSince)}`);
    expect(next.body.messages.map(m => m.content)).toEqual(['msg 6', 'msg 7']);
    expect(next.body.hasMore).toBe(false);
    expect(next.body.nextSince).toBeNull();
  });

  it('since sem mensagens novas devolve lista vazia', async () => {
    await seedMessages(2);
    const res = await getPage(`?since=${encodeURIComponent('2030-01-01T00:00:00.000Z')}`);
    expect(res.body.messages).toEqual([]);
    expect(res.body.hasMore).toBe(false);
  });

  it('respeita o limit e devolve os metadados de paginação', async () => {
    await seedMessages(7);
    const res = await getPage('?limit=3');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('messages');
    expect(res.body).toHaveProperty('hasMore', true);
    expect(res.body).toHaveProperty('nextCursor');
    expect(res.body.messages.map(m => m.content)).toEqual(['msg 5', 'msg 6', 'msg 7']);
    expect(new Date(res.body.nextCursor).getTime()).toBe(new Date(res.body.messages[0].created_at).getTime());
  });

  it('carrega o bloco anterior ao receber o cursor before, sem duplicar nem pular mensagens', async () => {
    await seedMessages(7);
    const page1 = await getPage('?limit=3');
    const page2 = await getPage(`?limit=3&before=${encodeURIComponent(page1.body.nextCursor)}`);

    expect(page2.status).toBe(200);
    expect(page2.body.messages.map(m => m.content)).toEqual(['msg 2', 'msg 3', 'msg 4']);
    expect(page2.body.hasMore).toBe(true);
    const oldest = new Date(page2.body.messages[0].created_at).getTime();
    expect(oldest).toBeLessThan(new Date(page1.body.nextCursor).getTime());
  });

  it('percorre todo o histórico página a página até hasMore ser false', async () => {
    await seedMessages(7);
    const collected = [];
    let cursor = null;
    let guard = 0;

    do {
      const q = cursor ? `?limit=3&before=${encodeURIComponent(cursor)}` : '?limit=3';
      const res = await getPage(q);
      collected.unshift(...res.body.messages.map(m => m.content));
      cursor = res.body.hasMore ? res.body.nextCursor : null;
      guard++;
    } while (cursor && guard < 10);

    expect(collected).toEqual(['msg 1', 'msg 2', 'msg 3', 'msg 4', 'msg 5', 'msg 6', 'msg 7']);
    expect(guard).toBe(3);
  });

  it('na última página hasMore é false e nextCursor é null', async () => {
    await seedMessages(4);
    const res = await getPage('?limit=4');
    expect(res.body.messages).toHaveLength(4);
    expect(res.body.hasMore).toBe(false);
    expect(res.body.nextCursor).toBeNull();
  });

  it('usa 50 mensagens por padrão', async () => {
    await seedMessages(55);
    const res = await getPage();
    expect(res.body.messages).toHaveLength(50);
    expect(res.body.hasMore).toBe(true);
    expect(res.body.messages[49].content).toBe('msg 55');
  });

  it('limita o parâmetro limit ao teto de 100 mensagens', async () => {
    await seedMessages(105);
    const res = await getPage('?limit=99999');
    expect(res.status).toBe(200);
    expect(res.body.messages).toHaveLength(100);
    expect(res.body.hasMore).toBe(true);
  });

  it('corrige limit inválido para os limites permitidos', async () => {
    await seedMessages(5);
    expect((await getPage('?limit=0')).body.messages).toHaveLength(5);
    expect((await getPage('?limit=abc')).body.messages).toHaveLength(5);
    expect((await getPage('?limit=-10')).body.messages).toHaveLength(1);
  });

  it('ignora um cursor before com data inválida', async () => {
    await seedMessages(3);
    const res = await getPage('?before=isso-nao-e-data');
    expect(res.status).toBe(200);
    expect(res.body.messages).toHaveLength(3);
  });

  it('não mistura mensagens de outras salas na paginação', async () => {
    const outra = await createRoom(author.id, { name: 'Outra' });
    await seedMessages(3);
    await seedMessages(3, outra.id);
    const res = await getPage('?limit=10');
    expect(res.body.messages).toHaveLength(3);
    expect(res.body.messages.every(m => m.room_id === room.id)).toBe(true);
  });

  it('sala sem mensagens devolve lista vazia', async () => {
    const res = await getPage();
    expect(res.body).toEqual({ messages: [], hasMore: false, nextCursor: null, nextSince: null });
  });
});
