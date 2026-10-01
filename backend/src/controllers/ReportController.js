const ReportService = require('../services/ReportService');

class ReportController {
  async create(req, res) {
    try {
      const userId = req.user.userId;
      const { message_id, reason } = req.body;
      const report = await ReportService.createReport(userId, message_id, reason);
      return res.status(201).json(report);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const reports = await ReportService.getAllReports();
      return res.status(200).json(reports);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar denúncias.' });
    }
  }

  async resolve(req, res) {
    try {
      const { status } = req.body;
      const report = await ReportService.resolveReport(req.params.id, status);
      return res.status(200).json(report);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ReportController();
