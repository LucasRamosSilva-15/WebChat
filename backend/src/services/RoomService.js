const RoomRepository = require('../repositories/RoomRepository');

class RoomService {
  async createRoom(roomData, userId) {
    if (!roomData.name || roomData.name.trim() === '') {
      throw new Error('O nome da sala é obrigatório.');
    }

    const newRoom = await RoomRepository.create({
      name: roomData.name,
      type: roomData.type || 'public',
      created_by: userId
    });

    return newRoom;
  }

  async getAllRooms() {
    return await RoomRepository.findAll();
  }

  async getRoomById(id) {
    const room = await RoomRepository.findById(id);
    if (!room) throw new Error('Sala não encontrada.');
    return room;
  }

  async deleteRoom(id, userId, isAdmin) {
    const room = await this.getRoomById(id);
    
    // Regra de negócio: Apenas o criador ou um admin podem deletar a sala
    if (room.created_by !== userId && !isAdmin) {
      throw new Error('Você não tem permissão para deletar esta sala.');
    }

    await RoomRepository.delete(id);
    return { message: 'Sala deletada com sucesso.' };
  }
}

module.exports = new RoomService();
