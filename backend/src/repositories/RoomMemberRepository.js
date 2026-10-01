const { RoomMember, User } = require('../models');

class RoomMemberRepository {
  async addMember(roomId, userId, role = 'user') {
    return await RoomMember.findOrCreate({
      where: { room_id: roomId, user_id: userId },
      defaults: { role }
    });
  }

  async findByRoomAndUser(roomId, userId) {
    return await RoomMember.findOne({ where: { room_id: roomId, user_id: userId } });
  }

  async countMembers(roomId) {
    return await RoomMember.count({ where: { room_id: roomId } });
  }

  async getMembersByRoom(roomId) {
    return await RoomMember.findAll({
      where: { room_id: roomId },
      include: [{ model: User, attributes: ['id', 'displayName', 'email'] }]
    });
  }

  async countTotalMemberships() {
    return await RoomMember.count();
  }

  async countUniqueUsers() {
    const unique = await RoomMember.findAll({
      attributes: ['user_id'],
      group: ['user_id']
    });
    return unique.length;
  }
}

module.exports = new RoomMemberRepository();
