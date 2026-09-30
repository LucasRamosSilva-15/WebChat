const { Message, User, Room } = require('../models');

class MessageRepository {
  async create(messageData) {
    return await Message.create(messageData);
  }

  async findByRoomId(roomId) {
    return await Message.findAll({
      where: { room_id: roomId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'displayName', 'profilePhoto'] }
      ],
      order: [['created_at', 'ASC']]
    });
  }

  async findById(id) {
    return await Message.findByPk(id);
  }

  async delete(id) {
    const message = await this.findById(id);
    if (!message) return false;
    await message.destroy();
    return true;
  }
}

module.exports = new MessageRepository();
