const { Feedback, User } = require('../models');

class FeedbackRepository {
  async create(feedbackData) {
    return await Feedback.create(feedbackData);
  }

  async findAll() {
    return await Feedback.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'displayName', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });
  }

  async findById(id) {
    return await Feedback.findByPk(id);
  }

  async updateStatus(id, status) {
    const feedback = await this.findById(id);
    if (!feedback) return null;
    return await feedback.update({ status });
  }

  async delete(id) {
    const feedback = await this.findById(id);
    if (!feedback) return false;
    await feedback.destroy();
    return true;
  }
}

module.exports = new FeedbackRepository();
