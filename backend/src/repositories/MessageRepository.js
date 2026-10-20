const { Op } = require('sequelize');
const { Message, User, Room } = require('../models');

class MessageRepository {
  async create(messageData) {
    return await Message.create(messageData);
  }

  /**
   * Histórico de uma sala com paginação baseada em cursor (data de criação).
   * @param {string} roomId - UUID da sala
   * @param {object} options
   * @param {number} options.limit - quantidade de mensagens desejadas (default: 50)
   * @param {string|Date|null} options.before - só traz mensagens criadas ANTES desta data
   * @returns {{ messages: Array, hasMore: boolean, nextCursor: Date|null }}
   */
  async findByRoomId(roomId, { limit = 50, before = null, since = null } = {}) {
    const pageSize = Number(limit);
    const whereClause = { room_id: roomId };

    if (since) {
      // Modo sincronização: mensagens mais novas que `since`, já em ordem cronológica.
      whereClause.created_at = { [Op.gt]: new Date(since) };
      const newer = await Message.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'user', attributes: ['id', 'displayName', 'profilePhoto'] }
        ],
        order: [['created_at', 'ASC']],
        limit: pageSize + 1
      });
      const moreNewer = newer.length > pageSize;
      const page = moreNewer ? newer.slice(0, pageSize) : newer;
      const nextSince = moreNewer && page.length > 0 ? page[page.length - 1].created_at : null;
      return { messages: page, hasMore: moreNewer, nextCursor: null, nextSince };
    }

    if (before) {
      whereClause.created_at = { [Op.lt]: new Date(before) };
    }

    // Pede limit + 1: se vier a mais, sabemos que ainda existem mensagens antigas
    // sem precisar de um COUNT(*) extra.
    const found = await Message.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['id', 'displayName', 'profilePhoto'] }
      ],
      order: [['created_at', 'DESC']],
      limit: pageSize + 1
    });

    const hasMore = found.length > pageSize;
    const messages = hasMore ? found.slice(0, pageSize) : found;

    // O banco devolve da mais nova para a mais antiga; o chat exibe em ordem cronológica.
    messages.reverse();

    // Cursor da próxima página = data da mensagem mais antiga deste bloco
    const nextCursor = hasMore && messages.length > 0 ? messages[0].created_at : null;

    return { messages, hasMore, nextCursor, nextSince: null };
  }

  async searchByRoom(roomId, query) {
    const { Op } = require('sequelize');
    return await Message.findAll({
      where: { 
        room_id: roomId,
        content: {
          [Op.iLike]: `%${query}%`
        }
      },
      include: [
        { model: User, as: 'user', attributes: ['id', 'displayName', 'profilePhoto'] }
      ],
      order: [['created_at', 'ASC']]
    });
  }

  async findById(id) {
    return await Message.findByPk(id);
  }

  async delete(id) {
    const message = await this.findById(id);
    if (!message) return false;
    await message.destroy();
    return true;
  }
}

module.exports = new MessageRepository();
