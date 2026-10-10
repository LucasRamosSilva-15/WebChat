const { Report, User, Message } = require('../models');

class ReportRepository {
  async create(reportData) {
    return await Report.create(reportData);
  }

  async findAll() {
    return await Report.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'displayName', 'email'] },
        { model: Message, as: 'message', attributes: ['id', 'content', 'created_at'] }
      ],
      order: [['created_at', 'DESC']]
    });
  }

  async countPending() {
    return await Report.count({ where: { status: 'pending' } });
  }

  async findById(id) {
    return await Report.findByPk(id);
  }

  async updateStatus(id, status, reason) {
    const report = await this.findById(id);
    if (!report) return null;
    const payload = {};
    if (status) payload.status = status;
    if (reason !== undefined) payload.reason = reason;
    return await report.update(payload);
  }

  async delete(id) {
    const report = await this.findById(id);
    if (!report) return false;
    await report.destroy();
    return true;
  }
}

module.exports = new ReportRepository();
