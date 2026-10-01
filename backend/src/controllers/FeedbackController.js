const FeedbackService = require('../services/FeedbackService');
const { handleError } = require('./errorHandler');

class FeedbackController {
  async create(req, res) {
    try {
      const { comment, reason, message, images } = req.body;
      // O frontend antigo enviava "reason" + "message"; o modelo novo guarda tudo em "comment".
      const text = comment || [reason, message].filter(Boolean).join(': ');
      const feedback = await FeedbackService.submitFeedback(req.userId, text, images || []);
      return res.status(201).json(feedback);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async list(req, res) {
    try {
      const feedbacks = await FeedbackService.getAllFeedbacks();
      return res.status(200).json(feedbacks);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async updateStatus(req, res) {
    try {
      const feedback = await FeedbackService.resolveFeedback(req.params.id, req.body.status);
      return res.status(200).json(feedback);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async remove(req, res) {
    try {
      const result = await FeedbackService.deleteFeedback(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }
}

module.exports = new FeedbackController();
