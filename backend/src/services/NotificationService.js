const NotificationRepository = require('../repositories/NotificationRepository');

class NotificationService {
  async getUserNotifications(userId) {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório.');
    }

    let notifications = await NotificationRepository.findByUserId(userId);

    if (notifications.length === 0) {
      const seeded = [
        {
          user_id: userId,
          type: 'system',
          title: 'Boas-vindas ao SkyRipple! 🎉',
          content: 'Explore as salas de conversação públicas e troque ideias em tempo real.',
          link: '/rooms',
          read: false
        },
        {
          user_id: userId,
          type: 'info',
          title: 'Novo limitador de mensagens ⚡',
          content: 'As mensagens nas salas agora contam com o limite de 1.000 caracteres e indicador visual.',
          link: '/rooms',
          read: false
        },
        {
          user_id: userId,
          type: 'system',
          title: 'Personalize o seu Perfil ✨',
          content: 'Adicione uma foto e seu recado público na página de personalização.',
          link: '/custom',
          read: true
        }
      ];

      for (const item of seeded) {
        await NotificationRepository.create(item);
      }

      notifications = await NotificationRepository.findByUserId(userId);
    }

    return notifications.map(n => ({
      id: n.id,
      type: n.type || 'system',
      title: n.title,
      content: n.content || '',
      link: n.link || null,
      read: Boolean(n.read),
      data: n.data || null,
      time: n.created_at
    }));
  }

  async addNotification(userId, data) {
    const { type, title, content, link, extraData } = data;
    if (!title) {
      throw new Error('Título da notificação é obrigatório.');
    }

    const created = await NotificationRepository.create({
      user_id: userId || null,
      type: type || 'system',
      title,
      content: content || '',
      link: link || null,
      read: false,
      data: typeof extraData === 'object' ? JSON.stringify(extraData) : (extraData || null)
    });

    const formatted = {
      id: created.id,
      type: created.type,
      title: created.title,
      content: created.content,
      link: created.link,
      read: created.read,
      data: created.data,
      time: created.created_at
    };

    if (global.io) {
      if (userId) {
        global.io.to(`user_${userId}`).emit('new_notification', formatted);
      } else {
        global.io.emit('new_notification', formatted);
      }
    }

    return formatted;
  }

  async markAsRead(id, userId) {
    if (!id) {
      throw new Error('ID da notificação é obrigatório.');
    }
    const updated = await NotificationRepository.markAsRead(id, userId);
    if (!updated) {
      throw new Error('Notificação não encontrada.');
    }
    return { success: true, id };
  }

  async markAllAsRead(userId) {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório.');
    }
    await NotificationRepository.markAllAsRead(userId);
    return { success: true };
  }

  async deleteNotification(id, userId) {
    if (!id) {
      throw new Error('ID da notificação é obrigatório.');
    }
    const count = await NotificationRepository.delete(id, userId);
    return { success: count > 0 };
  }

  async clearAll(userId) {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório.');
    }
    await NotificationRepository.clearAll(userId);
    return { success: true };
  }
}

module.exports = new NotificationService();
