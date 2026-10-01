const FeedbackService = require('../services/FeedbackService');

class FeedbackController {
  async submit(req, res) {
    try {
      const userId = req.user.userId;
      const { comment, images } = req.body;
      const feedback = await FeedbackService.submitFeedback(userId, comment, images);
      return res.status(201).json(feedback);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const feedbacks = await FeedbackService.getAllFeedbacks();
      return res.status(200).json(feedbacks);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar feedbacks.' });
    }
  }
}

module.exports = new FeedbackController();
