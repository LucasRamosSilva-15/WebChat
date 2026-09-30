const FeedbackRepository = require('../repositories/FeedbackRepository');

class FeedbackService {
  async submitFeedback(userId, comment, images = []) {
    if (!comment || comment.trim() === '') {
      throw new Error('O comentário do feedback é obrigatório.');
    }

    return await FeedbackRepository.create({
      user_id: userId,
      comment,
      images
    });
  }

  async getAllFeedbacks() {
    return await FeedbackRepository.findAll();
  }

  async resolveFeedback(id, newStatus) {
    const validStatuses = ['pending', 'resolved'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Status de feedback inválido.');
    }

    const updated = await FeedbackRepository.updateStatus(id, newStatus);
    if (!updated) throw new Error('Feedback não encontrado.');
    return updated;
  }

  async deleteFeedback(id) {
    const success = await FeedbackRepository.delete(id);
    if (!success) throw new Error('Feedback não encontrado.');
    return { success: true };
  }
}

module.exports = new FeedbackService();
