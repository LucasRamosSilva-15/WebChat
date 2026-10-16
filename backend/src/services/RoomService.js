const RoomRepository = require('../repositories/RoomRepository');
const RoomMemberRepository = require('../repositories/RoomMemberRepository');
const { sanitizeText } = require('../utils/security');
const { logSecurityEvent } = require('../utils/auditLogger');

class RoomService {
  async createRoom(roomData, userId) {
    const cleanName = roomData.name ? sanitizeText(roomData.name) : '';
    if (!cleanName || cleanName.trim() === '') {
      throw new Error('O nome da sala é obrigatório.');
    }

    const newRoom = await RoomRepository.create({
      name: cleanName,
      type: roomData.type || 'public',
      description: roomData.description ? sanitizeText(roomData.description) : null,
      category: roomData.category,
      image_url: roomData.image_url,
      created_by: userId
    });

    await RoomMemberRepository.addMember(newRoom.id, userId, 'owner');
    return newRoom;
  }

  async getAllRooms() {
    const rooms = await RoomRepository.findAll();
    const roomsWithCount = [];
    for (const room of rooms) {
      const count = await RoomMemberRepository.countMembers(room.id);
      roomsWithCount.push({
        ...room.toJSON(),
        members_count: count
      });
    }
    return roomsWithCount;
  }

  async getRoomById(id, userId = null) {
    const room = await RoomRepository.findById(id);
    if (!room) throw new Error('Sala não encontrada.');

    const count = await RoomMemberRepository.countMembers(id);
    let is_member = false;
    let current_user_role = null;

    if (userId) {
      const member = await RoomMemberRepository.findByRoomAndUser(id, userId);
      if (member) {
        is_member = true;
        current_user_role = member.role;
      }
    }

    return {
      ...room.toJSON(),
      members_count: count,
      is_member,
      current_user_role
    };
  }

  async updateRoom(id, updateData, userId, isAdmin) {
    const room = await this.getRoomById(id, userId);
    if (room.created_by !== userId && !isAdmin) {
      throw new Error('Você não tem permissão para editar esta sala.');
    }

    const payload = {};
    if (updateData.name !== undefined) {
      const cleanName = sanitizeText(updateData.name);
      if (!cleanName || cleanName.trim() === '') {
        throw new Error('O nome da sala não pode ficar vazio.');
      }
      payload.name = cleanName;
    }
    if (updateData.description !== undefined) {
      payload.description = updateData.description ? sanitizeText(updateData.description) : null;
    }
    if (updateData.category !== undefined) {
      payload.category = updateData.category;
    }
    if (updateData.image_url !== undefined) {
      payload.image_url = updateData.image_url;
    }

    const updated = await RoomRepository.update(id, payload);

    if (global.io) {
      global.io.to(id).emit('room_updated', updated);
    }

    logSecurityEvent({
      eventType: 'ROOM_MODERATION_ACTION',
      level: 'INFO',
      actor: { id: userId, role: isAdmin ? 'admin' : 'owner' },
      resource: `room:${id}`,
      action: 'update_room_details',
      status: 'SUCCESS',
      details: payload
    });

    return updated;
  }

  async deleteRoom(id, userId, isAdmin) {
    const room = await this.getRoomById(id);

    if (room.created_by !== userId && !isAdmin) {
      throw new Error('Você não tem permissão para deletar esta sala.');
    }

    await RoomRepository.delete(id);
    return { message: 'Sala deletada com sucesso.' };
  }

  async joinRoom(roomId, userId) {
    const room = await RoomRepository.findById(roomId);
    if (!room) throw new Error('Sala não encontrada.');

    const member = await RoomMemberRepository.addMember(roomId, userId, 'user');
    return { success: true, member };
  }

  async getRoomMembers(roomId) {
    const members = await RoomMemberRepository.getMembersByRoom(roomId);
    return members.map(m => ({
      id: m.User.id,
      name: m.User.displayName || m.User.email,
      email: m.User.email,
      role: m.role,
      joined_at: m.joined_at,
      online: false
    }));
  }

  async updateMemberRole(roomId, targetUserId, newRole, requesterId, isAdmin) {
    const allowedRoles = ['moderator', 'user'];
    if (!allowedRoles.includes(newRole)) {
      throw new Error('Função inválida. Escolha entre "moderator" ou "user".');
    }

    const room = await RoomRepository.findById(roomId);
    if (!room) throw new Error('Sala não encontrada.');

    const isOwner = (room.owner_id === requesterId || room.created_by === requesterId);
    if (!isOwner && !isAdmin) {
      throw new Error('Você não tem permissão para alterar funções de membros desta sala.');
    }

    if (targetUserId === room.created_by || targetUserId === room.owner_id) {
      throw new Error('Não é possível alterar o cargo do dono da sala.');
    }

    const targetMember = await RoomMemberRepository.findByRoomAndUser(roomId, targetUserId);
    if (!targetMember) {
      throw new Error('O usuário especificado não é membro desta sala.');
    }

    await RoomMemberRepository.updateRole(roomId, targetUserId, newRole);

    if (global.io) {
      global.io.to(roomId).emit('member_role_updated', {
        roomId,
        userId: targetUserId,
        role: newRole
      });
    }

    logSecurityEvent({
      eventType: 'ROOM_ROLE_CHANGE',
      level: 'INFO',
      actor: { id: requesterId, role: isAdmin ? 'admin' : 'owner' },
      resource: `room:${roomId}`,
      action: 'update_member_role',
      status: 'SUCCESS',
      details: { targetUserId, newRole }
    });

    return { success: true, roomId, userId: targetUserId, role: newRole };
  }

  async kickMember(roomId, targetUserId, requesterId, isAdmin, reason = '') {
    const room = await RoomRepository.findById(roomId);
    if (!room) throw new Error('Sala não encontrada.');

    if (targetUserId === room.created_by || targetUserId === room.owner_id) {
      throw new Error('Não é possível expulsar o dono da sala.');
    }

    const targetMember = await RoomMemberRepository.findByRoomAndUser(roomId, targetUserId);
    if (!targetMember) {
      throw new Error('O usuário especificado não é membro desta sala.');
    }

    const requesterMember = await RoomMemberRepository.findByRoomAndUser(roomId, requesterId);
    const requesterRole = requesterMember?.role;
    const isOwner = isOwnerOrCreator(room, requesterId);

    if (!isAdmin && !isOwner && requesterRole !== 'moderator') {
      throw new Error('Você não tem permissão para expulsar membros desta sala.');
    }

    if (requesterRole === 'moderator' && !isOwner && !isAdmin) {
      if (targetMember.role === 'moderator' || targetMember.role === 'owner') {
        throw new Error('Moderadores não podem expulsar o dono ou outros moderadores.');
      }
    }

    await RoomMemberRepository.removeMember(roomId, targetUserId);

    if (global.io) {
      global.io.to(roomId).emit('member_kicked', {
        roomId,
        userId: targetUserId,
        reason: reason || 'Expulso pela moderação da sala'
      });
      global.io.to(`user_${targetUserId}`).emit('kicked_from_room', {
        roomId,
        roomName: room.name,
        reason: reason || 'Você foi removido desta sala pela moderação'
      });
    }

    logSecurityEvent({
      eventType: 'ROOM_MEMBER_KICKED',
      level: 'WARN',
      actor: { id: requesterId, role: isAdmin ? 'admin' : (isOwner ? 'owner' : 'moderator') },
      resource: `room:${roomId}`,
      action: 'kick_member',
      status: 'SUCCESS',
      details: { targetUserId, reason }
    });

    return { success: true, message: 'Membro expulso da sala com sucesso.' };
  }

  async transferOwnership(roomId, targetUserId, requesterId, isAdmin) {
    const room = await RoomRepository.findById(roomId);
    if (!room) throw new Error('Sala não encontrada.');

    const isOwner = isOwnerOrCreator(room, requesterId);
    if (!isOwner && !isAdmin) {
      throw new Error('Você não tem permissão para transferir a posse desta sala.');
    }

    if (targetUserId === requesterId) {
      throw new Error('Você já é o dono desta sala.');
    }

    const targetMember = await RoomMemberRepository.findByRoomAndUser(roomId, targetUserId);
    if (!targetMember) {
      throw new Error('O novo dono precisa ser membro da sala.');
    }

    await RoomRepository.update(roomId, {
      owner_id: targetUserId,
      created_by: targetUserId
    });

    await RoomMemberRepository.updateRole(roomId, targetUserId, 'owner');
    if (requesterId) {
      await RoomMemberRepository.updateRole(roomId, requesterId, 'moderator');
    }

    if (global.io) {
      global.io.to(roomId).emit('ownership_transferred', {
        roomId,
        oldOwnerId: requesterId,
        newOwnerId: targetUserId
      });
    }

    logSecurityEvent({
      eventType: 'ROOM_OWNERSHIP_TRANSFERRED',
      level: 'SECURITY',
      actor: { id: requesterId, role: 'owner' },
      resource: `room:${roomId}`,
      action: 'transfer_ownership',
      status: 'SUCCESS',
      details: { oldOwnerId: requesterId, newOwnerId: targetUserId }
    });

    return { success: true, message: 'Posse da sala transferida com sucesso.' };
  }
}

function isOwnerOrCreator(room, userId) {
  if (!room || !userId) return false;
  return room.owner_id === userId || room.created_by === userId;
}

module.exports = new RoomService();
