// Anexos: áudio gravado e documentos (unitário + integração REST)
const request = require('supertest');
const { app } = require('../server');
const { resetDb, closeDb, createUser, createRoom, tokenFor, authHeader } = require('./helpers');
const { validateAttachment, toAttachmentView, MAX_ATTACHMENT_BYTES } = require('../src/utils/attachments');

const b64 = (bytes) => Buffer.alloc(bytes, 1).toString('base64');
const audio = (extra = {}) => ({ url: `data:audio/webm;codecs=opus;base64,${b64(64)}`, type: 'audio/webm', name: 'voz.webm', ...extra });
const pdf = (extra = {}) => ({ url: `data:application/pdf;base64,${b64(128)}`, type: 'application/pdf', name: 'trabalho.pdf', ...extra });

describe('validateAttachment', () => {
  it('retorna null sem anexo', () => {
    expect(validateAttachment(null)).toBeNull();
    expect(validateAttachment(undefined)).toBeNull();
  });

  it('aceita áudio (com codecs) e documento, calculando o tamanho real', () => {
    const a = validateAttachment(audio());
    expect(a).toMatchObject({ attachment_type: 'audio/webm', attachment_name: 'voz.webm', attachment_size: 64 });
    const d = validateAttachment(pdf());
    expect(d).toMatchObject({ attachment_type: 'application/pdf', attachment_size: 128 });
  });

  it('rejeita tipos não permitidos (ex.: executáveis e html)', () => {
    expect(() => validateAttachment({ url: `data:application/x-msdownload;base64,${b64(10)}` })).toThrow('Tipo de arquivo não permitido');
    expect(() => validateAttachment({ url: `data:text/html;base64,${b64(10)}` })).toThrow('Tipo de arquivo não permitido');
    expect(() => validateAttachment({ url: `data:image/svg+xml;base64,${b64(10)}` })).toThrow('Tipo de arquivo não permitido');
  });

  it('rejeita data URL malformada e anexo não-objeto', () => {
    expect(() => validateAttachment({ url: 'http://evil.com/a.pdf' })).toThrow('Anexo inválido');
    expect(() => validateAttachment('texto')).toThrow('Anexo inválido');
    expect(() => validateAttachment({ url: 'data:application/pdf;base64,@@@' })).toThrow('Anexo inválido');
  });

  it('rejeita tipo declarado diferente do conteúdo', () => {
    expect(() => validateAttachment(pdf({ type: 'audio/webm' }))).toThrow('não confere');
  });

  it('rejeita arquivo acima de 5 MB', () => {
    const big = { url: `data:application/pdf;base64,${b64(MAX_ATTACHMENT_BYTES + 10)}` };
    expect(() => validateAttachment(big)).toThrow('5 MB');
  });

  it('higieniza o nome do arquivo', () => {
    const r = validateAttachment(pdf({ name: '../../etc/pass\nwd.pdf' }));
    expect(r.attachment_name).not.toMatch(/[\\/\n]/);
  });

  it('toAttachmentView monta o objeto da API', () => {
    const v = toAttachmentView({ attachment_url: 'u', attachment_type: 'audio/webm', attachment_name: 'n', attachment_size: 3 });
    expect(v).toEqual({ url: 'u', type: 'audio/webm', name: 'n', size: 3, kind: 'audio' });
    expect(toAttachmentView({})).toBeNull();
  });
});

describe('Anexos via REST', () => {
  let alice, bob, room, authA, authB;

  beforeEach(async () => {
    await resetDb();
    alice = await createUser({ displayName: 'Alice' });
    bob = await createUser({ displayName: 'Bob' });
    room = await createRoom(alice.id);
    authA = authHeader(tokenFor(alice.id));
    authB = authHeader(tokenFor(bob.id));
  });
  afterAll(closeDb);

  it('sala: salva e lista mensagem só com áudio', async () => {
    const res = await request(app).post(`/api/rooms/${room.id}/messages`).set(authA).send({ attachment: audio() });
    expect(res.status).toBe(201);
    expect(res.body.attachment_type).toBe('audio/webm');

    const list = await request(app).get(`/api/rooms/${room.id}/messages`).set(authA);
    expect(list.body.messages[0]).toMatchObject({ attachment_name: 'voz.webm', attachment_size: 64 });
  });

  it('sala: documento com legenda', async () => {
    const res = await request(app).post(`/api/rooms/${room.id}/messages`).set(authA).send({ content: 'Segue o PDF', attachment: pdf() });
    expect(res.status).toBe(201);
    expect(res.body.content).toBe('Segue o PDF');
    expect(res.body.attachment_type).toBe('application/pdf');
  });

  it('sala: arquivo proibido retorna 400', async () => {
    const res = await request(app).post(`/api/rooms/${room.id}/messages`).set(authA)
      .send({ content: 'x', attachment: { url: `data:text/html;base64,${b64(5)}` } });
    expect(res.status).toBe(400);
  });

  it('direct: envia áudio e a lista traz attachment com kind', async () => {
    const conv = await request(app).post('/api/directs/conversations').set(authA).send({ targetUserId: bob.id });
    const send = await request(app).post(`/api/directs/conversations/${conv.body.id}/messages`).set(authA).send({ attachment: audio() });
    expect(send.status).toBe(201);
    expect(send.body.attachment).toMatchObject({ kind: 'audio', type: 'audio/webm', name: 'voz.webm' });

    const list = await request(app).get(`/api/directs/conversations/${conv.body.id}/messages`).set(authB);
    expect(list.body.messages[0].attachment).toMatchObject({ kind: 'audio', size: 64 });
  });

  it('direct: documento inválido retorna 400', async () => {
    const conv = await request(app).post('/api/directs/conversations').set(authA).send({ targetUserId: bob.id });
    const res = await request(app).post(`/api/directs/conversations/${conv.body.id}/messages`).set(authA)
      .send({ attachment: { url: 'qualquer coisa' } });
    expect(res.status).toBe(400);
  });
});
