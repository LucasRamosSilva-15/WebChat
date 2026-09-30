const { Room, User } = require('../models');

class RoomRepository {
  async create(roomData) {
    return await Room.create(roomData);
  }

  async findAll() {
    return await Room.findAll({
      include: [{ model: User, as: 'creator', attributes: ['id', 'displayName', 'email'] }]
    });
  }

  async findById(id) {
    return await Room.findByPk(id, {
      include: [{ model: User, as: 'creator', attributes: ['id', 'displayName', 'email'] }]
    });
  }

  async update(id, updateData) {
    const room = await this.findById(id);
    if (!room) return null;
    return await room.update(updateData);
  }

  async delete(id) {
    const room = await this.findById(id);
    if (!room) return false;
    await room.destroy();
    return true;
  }
}

module.exports = new RoomRepository();
