const RoomRepository = require('../repositories/RoomRepository');
const RoomMemberRepository = require('../repositories/RoomMemberRepository');

class RoomService {
  async createRoom(roomData, userId) {
    if (!roomData.name || roomData.name.trim() === '') {
      throw new Error('O nome da sala é obrigatório.');
    }

    const newRoom = await RoomRepository.create({
      name: roomData.name,
      type: roomData.type || 'public',
      description: roomData.description?.trim(),
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
}

module.exports = new RoomService();
