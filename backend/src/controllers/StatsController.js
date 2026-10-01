const RoomRepository = require('../repositories/RoomRepository');
const RoomMemberRepository = require('../repositories/RoomMemberRepository');
const { handleError } = require('./errorHandler');

class StatsController {
  async getGlobalStats(req, res) {
    try {
      const active_rooms = await RoomRepository.count();
      const total_room_memberships = await RoomMemberRepository.countTotalMemberships();
      const unique_users = await RoomMemberRepository.countUniqueUsers();

      return res.status(200).json({
        active_rooms,
        unique_users,
        total_room_memberships
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
}

module.exports = new StatsController();
