const ReportRepository = require('../repositories/ReportRepository');

class ReportService {
  async createReport(userId, messageId, reason) {
    if (!reason || reason.trim() === '') {
      throw new Error('O motivo da denúncia é obrigatório.');
    }

    return await ReportRepository.create({
      user_id: userId,
      message_id: messageId,
      reason
    });
  }

  async getAllReports() {
    return await ReportRepository.findAll();
  }

  async resolveReport(id, newStatus) {
    const validStatuses = ['pending', 'resolved', 'dismissed'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Status inválido.');
    }

    const updated = await ReportRepository.updateStatus(id, newStatus);
    if (!updated) throw new Error('Denúncia não encontrada.');
    return updated;
  }

  async deleteReport(id) {
    const success = await ReportRepository.delete(id);
    if (!success) throw new Error('Denúncia não encontrada.');
    return { success: true };
  }
}

module.exports = new ReportService();
