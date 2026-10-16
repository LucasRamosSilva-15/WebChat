const request = require('supertest');
const { app } = require('../server');
const { resetDb, closeDb, createUser, createRoom, createMessage, tokenFor, adminToken, authHeader } = require('./helpers');
const { RoomMember, Message } = require('../src/models');

describe('Room Ownership & Moderation System', () => {
  let owner, mod, member, stranger;
  let ownerAuth, modAuth, memberAuth, strangerAuth, admAuth;
  let room;

  beforeEach(async () => {
    await resetDb();
    owner = await createUser({ displayName: 'Dono Da Sala' });
    mod = await createUser({ displayName: 'Moderador' });
    member = await createUser({ displayName: 'Membro Comum' });
    stranger = await createUser({ displayName: 'Estranho' });

    ownerAuth = authHeader(tokenFor(owner.id));
    modAuth = authHeader(tokenFor(mod.id));
    memberAuth = authHeader(tokenFor(member.id));
    strangerAuth = authHeader(tokenFor(stranger.id));
    admAuth = authHeader(adminToken());

    room = await createRoom(owner.id, { name: 'Comunidade Alpha' });
    await RoomMember.create({ room_id: room.id, user_id: owner.id, role: 'owner' });
    await RoomMember.create({ room_id: room.id, user_id: mod.id, role: 'moderator' });
    await RoomMember.create({ room_id: room.id, user_id: member.id, role: 'user' });
  });

  afterAll(closeDb);

  describe('PUT /api/rooms/:id (Edição da Sala)', () => {
    it('permite que o dono edite o nome e descrição da sala', async () => {
      const res = await request(app)
        .put(`/api/rooms/${room.id}`)
        .set(ownerAuth)
        .send({ name: 'Comunidade Beta', description: 'Nova Descrição Segura' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Comunidade Beta');
      expect(res.body.description).toBe('Nova Descrição Segura');
    });

    it('impede que membro comum ou moderador edite a sala', async () => {
      const resMod = await request(app)
        .put(`/api/rooms/${room.id}`)
        .set(modAuth)
        .send({ name: 'Hackeada' });
      expect(resMod.status).toBe(403);

      const resMember = await request(app)
        .put(`/api/rooms/${room.id}`)
        .set(memberAuth)
        .send({ name: 'Hackeada' });
      expect(resMember.status).toBe(403);
    });

    it('permite que o admin global edite qualquer sala', async () => {
      const res = await request(app)
        .put(`/api/rooms/${room.id}`)
        .set(admAuth)
        .send({ name: 'Renomeada pelo Admin' });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Renomeada pelo Admin');
    });
  });

  describe('PATCH /api/rooms/:roomId/members/:userId/role (Promoção/Rebaixamento)', () => {
    it('permite que o dono promova um membro comum a moderador', async () => {
      const res = await request(app)
        .patch(`/api/rooms/${room.id}/members/${member.id}/role`)
        .set(ownerAuth)
        .send({ role: 'moderator' });

      expect(res.status).toBe(200);
      expect(res.body.role).toBe('moderator');

      const saved = await RoomMember.findOne({ where: { room_id: room.id, user_id: member.id } });
      expect(saved.role).toBe('moderator');
    });

    it('impede que moderadores ou membros comuns alterem cargos', async () => {
      const res = await request(app)
        .patch(`/api/rooms/${room.id}/members/${member.id}/role`)
        .set(modAuth)
        .send({ role: 'moderator' });
      expect(res.status).toBe(403);
    });

    it('impede alterar o cargo do dono da sala', async () => {
      const res = await request(app)
        .patch(`/api/rooms/${room.id}/members/${owner.id}/role`)
        .set(ownerAuth)
        .send({ role: 'user' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/dono/i);
    });
  });

  describe('DELETE /api/rooms/:roomId/members/:userId (Expulsão / Kick)', () => {
    it('permite que o dono expulse moderadores ou membros comuns', async () => {
      const res = await request(app)
        .delete(`/api/rooms/${room.id}/members/${mod.id}`)
        .set(ownerAuth);

      expect(res.status).toBe(200);
      const exists = await RoomMember.findOne({ where: { room_id: room.id, user_id: mod.id } });
      expect(exists).toBeNull();
    });

    it('permite que moderador expulse membro comum', async () => {
      const res = await request(app)
        .delete(`/api/rooms/${room.id}/members/${member.id}`)
        .set(modAuth);

      expect(res.status).toBe(200);
      const exists = await RoomMember.findOne({ where: { room_id: room.id, user_id: member.id } });
      expect(exists).toBeNull();
    });

    it('impede que moderador expulse o dono da sala', async () => {
      const res = await request(app)
        .delete(`/api/rooms/${room.id}/members/${owner.id}`)
        .set(modAuth);

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/dono/i);
    });

    it('impede que membro comum expulse qualquer pessoa', async () => {
      const res = await request(app)
        .delete(`/api/rooms/${room.id}/members/${mod.id}`)
        .set(memberAuth);

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/rooms/:id/transfer-ownership (Transferência de Posse)', () => {
    it('transfere a posse da sala com sucesso para outro membro', async () => {
      const res = await request(app)
        .post(`/api/rooms/${room.id}/transfer-ownership`)
        .set(ownerAuth)
        .send({ newOwnerId: member.id });

      expect(res.status).toBe(200);

      const updatedRoom = await request(app).get(`/api/rooms/${room.id}`).set(memberAuth);
      expect(updatedRoom.body.created_by).toBe(member.id);

      const newOwnerMember = await RoomMember.findOne({ where: { room_id: room.id, user_id: member.id } });
      expect(newOwnerMember.role).toBe('owner');

      const oldOwnerMember = await RoomMember.findOne({ where: { room_id: room.id, user_id: owner.id } });
      expect(oldOwnerMember.role).toBe('moderator');
    });

    it('rejeita transferência se o solicitante não for o dono', async () => {
      const res = await request(app)
        .post(`/api/rooms/${room.id}/transfer-ownership`)
        .set(modAuth)
        .send({ newOwnerId: member.id });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/messages/:id (Moderação de Mensagens)', () => {
    let msgFromMember, msgFromOwner;

    beforeEach(async () => {
      msgFromMember = await createMessage(room.id, member.id, { content: 'Mensagem do membro comum' });
      msgFromOwner = await createMessage(room.id, owner.id, { content: 'Mensagem do dono' });
    });

    it('permite que o dono da sala apague mensagem de qualquer membro', async () => {
      const res = await request(app)
        .delete(`/api/messages/${msgFromMember.id}`)
        .set(ownerAuth);

      expect(res.status).toBe(200);
      const exists = await Message.findByPk(msgFromMember.id);
      expect(exists).toBeNull();
    });

    it('permite que o moderador da sala apague mensagem de membro comum', async () => {
      const res = await request(app)
        .delete(`/api/messages/${msgFromMember.id}`)
        .set(modAuth);

      expect(res.status).toBe(200);
      const exists = await Message.findByPk(msgFromMember.id);
      expect(exists).toBeNull();
    });

    it('impede que o moderador apague mensagem do dono da sala', async () => {
      const res = await request(app)
        .delete(`/api/messages/${msgFromOwner.id}`)
        .set(modAuth);

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/dono/i);
    });

    it('impede que membro comum apague mensagem de outros', async () => {
      const res = await request(app)
        .delete(`/api/messages/${msgFromOwner.id}`)
        .set(memberAuth);

      expect(res.status).toBe(403);
    });
  });
});
