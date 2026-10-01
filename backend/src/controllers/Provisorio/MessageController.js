const MessageService = require('../services/MessageService');

class MessageController {
  async send(req, res) {
    try {
      const userId = req.user.userId;
      const { room_id, content } = req.body;
      const message = await MessageService.sendMessage(room_id, userId, content);
      return res.status(201).json(message);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getByRoom(req, res) {
    try {
      const messages = await MessageService.getMessagesByRoom(req.params.roomId);
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const userId = req.user.userId;
      const isAdmin = req.user.isAdmin || false;
      const result = await MessageService.deleteMessage(req.params.id, userId, isAdmin);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(403).json({ error: error.message });
    }
  }
}

module.exports = new MessageController();
