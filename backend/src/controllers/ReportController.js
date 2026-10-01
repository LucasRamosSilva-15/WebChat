const ReportService = require('../services/ReportService');
const { handleError } = require('./errorHandler');

class ReportController {
  async create(req, res) {
    try {
      const { message_id, reason } = req.body;
      if (!message_id) {
        return res.status(400).json({ error: 'O ID da mensagem denunciada é obrigatório.' });
      }
      const report = await ReportService.createReport(req.userId, message_id, reason);
      return res.status(201).json(report);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async list(req, res) {
    try {
      const reports = await ReportService.getAllReports();
      return res.status(200).json(reports);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async updateStatus(req, res) {
    try {
      const report = await ReportService.resolveReport(req.params.id, req.body.status);
      return res.status(200).json(report);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async remove(req, res) {
    try {
      const result = await ReportService.deleteReport(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }
}

module.exports = new ReportController();
