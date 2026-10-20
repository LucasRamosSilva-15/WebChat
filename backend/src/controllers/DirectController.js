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
      const { limit, before, since } = req.query;
      const data = await DirectService.getConversationMessages(req.params.id, req.userId, { limit, before, since });
      return res.status(200).json(data);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async sendMessage(req, res) {
    try {
      const { content, imageUrl, attachment } = req.body;
      const message = await DirectService.sendMessage(req.params.id, req.userId, content, imageUrl, attachment);
      return res.status(201).json(message);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async setPublicKey(req, res) {
    try {
      const result = await DirectService.setPublicKey(req.userId, req.body.publicKey);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getPublicKey(req, res) {
    try {
      const result = await DirectService.getPublicKey(req.userId, req.params.userId);
      return res.status(200).json(result);
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
