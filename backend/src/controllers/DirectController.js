const DirectService = require('../services/DirectService');
const { handleError } = require('./errorHandler');

class DirectController {
  async listConversations(req, res) {
    try {
      const conversations = await DirectService.listConversations(req.userId);
      return res.status(200).json(conversations);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getOrCreate(req, res) {
    try {
      const { targetUserId } = req.body;
      const conversation = await DirectService.getOrCreateConversation(req.userId, targetUserId);
      return res.status(200).json(conversation);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async listMessages(req, res) {
    try {
      const messages = await DirectService.getConversationMessages(req.params.id, req.userId);
      return res.status(200).json(messages);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async sendMessage(req, res) {
    try {
      const { content, imageUrl } = req.body;
      const message = await DirectService.sendMessage(req.params.id, req.userId, content, imageUrl);
      return res.status(201).json(message);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async removeConversation(req, res) {
    try {
      const result = await DirectService.deleteConversation(req.params.id, req.userId);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async listUsers(req, res) {
    try {
      const users = await DirectService.searchAvailableUsers(req.userId, req.query.q);
      return res.status(200).json(users);
    } catch (error) {
      return handleError(res, error);
    }
  }
}

module.exports = new DirectController();
