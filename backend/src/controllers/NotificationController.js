const NotificationService = require('../services/NotificationService');
const { handleError } = require('./errorHandler');

class NotificationController {
  async list(req, res) {
    try {
      const notifications = await NotificationService.getUserNotifications(req.userId);
      return res.status(200).json(notifications);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async create(req, res) {
    try {
      const { type, title, content, link, data } = req.body;
      const notification = await NotificationService.addNotification(req.userId, {
        type,
        title,
        content,
        link,
        extraData: data
      });
      return res.status(201).json(notification);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async markAsRead(req, res) {
    try {
      const result = await NotificationService.markAsRead(req.params.id, req.userId);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async markAllAsRead(req, res) {
    try {
      const result = await NotificationService.markAllAsRead(req.userId);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async remove(req, res) {
    try {
      const result = await NotificationService.deleteNotification(req.params.id, req.userId);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async clearAll(req, res) {
    try {
      const result = await NotificationService.clearAll(req.userId);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }
}

module.exports = new NotificationController();
