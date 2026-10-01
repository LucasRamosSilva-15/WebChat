const MessageService = require('../services/MessageService');
const { handleError } = require('./errorHandler');

class MessageController {
  async send(req, res) {
    try {
      const message = await MessageService.sendMessage(req.params.roomId, req.userId, req.body.content);
      return res.status(201).json(message);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async listByRoom(req, res) {
    try {
      const messages = await MessageService.getMessagesByRoom(req.params.roomId);
      return res.status(200).json(messages);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async remove(req, res) {
    try {
      const isAdmin = !!req.admin;
      const result = await MessageService.deleteMessage(req.params.id, req.userId, isAdmin);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async search(req, res) {
    try {
      const messages = await MessageService.searchMessages(req.params.roomId, req.query.q);
      return res.status(200).json(messages);
    } catch (error) {
      return handleError(res, error);
    }
  }
}

module.exports = new MessageController();
