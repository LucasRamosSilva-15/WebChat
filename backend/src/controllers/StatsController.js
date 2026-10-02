const RoomRepository = require('../repositories/RoomRepository');
const UserRepository = require('../repositories/UserRepository');
const ReportRepository = require('../repositories/ReportRepository');
const { handleError } = require('./errorHandler');

class StatsController {
  async getGlobalStats(req, res) {
    try {
      const active_rooms = await RoomRepository.count();
      const total_users = await UserRepository.countAll();
      const pending_reports = await ReportRepository.countPending();
      const active_bans = await UserRepository.countBanned();

      return res.status(200).json({
        total_users,
        active_rooms,
        pending_reports,
        active_bans
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
}

module.exports = new StatsController();
