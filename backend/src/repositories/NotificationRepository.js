const { Op } = require('sequelize');
const { Notification, User } = require('../models');

class NotificationRepository {
  async findByUserId(userId, limit = 50) {
    const whereClause = userId
      ? {
        [Op.or]: [
          { user_id: userId },
          { user_id: null }
        ]
      }
      : { user_id: null };

    return await Notification.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit
    });
  }

  async findById(id) {
    return await Notification.findByPk(id);
  }

  async create(data) {
    return await Notification.create(data);
  }

  async markAsRead(id, userId) {
    const whereClause = userId
      ? {
        id,
        [Op.or]: [{ user_id: userId }, { user_id: null }]
      }
      : { id };

    const notif = await Notification.findOne({ where: whereClause });
    if (!notif) return null;
    return await notif.update({ read: true });
  }

  async markAllAsRead(userId) {
    const whereClause = userId
      ? {
        [Op.or]: [{ user_id: userId }, { user_id: null }],
        read: false
      }
      : { read: false };

    return await Notification.update(
      { read: true },
      { where: whereClause }
    );
  }

  async delete(id, userId) {
    const whereClause = userId
      ? {
        id,
        [Op.or]: [{ user_id: userId }, { user_id: null }]
      }
      : { id };

    return await Notification.destroy({ where: whereClause });
  }

  async clearAll(userId) {
    const whereClause = userId
      ? {
        [Op.or]: [{ user_id: userId }, { user_id: null }]
      }
      : {};

    return await Notification.destroy({ where: whereClause });
  }
}

module.exports = new NotificationRepository();
