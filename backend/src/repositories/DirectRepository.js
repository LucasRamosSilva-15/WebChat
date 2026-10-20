const { Op } = require('sequelize');
const { DirectConversation, DirectMessage, User } = require('../models');

class DirectRepository {
  async findConversationBetween(userA, userB) {
    return await DirectConversation.findOne({
      where: {
        [Op.or]: [
          { user1_id: userA, user2_id: userB },
          { user1_id: userB, user2_id: userA }
        ]
      },
      include: [
        { model: User, as: 'user1', attributes: ['id', 'displayName', 'email', 'profilePhoto', 'status'] },
        { model: User, as: 'user2', attributes: ['id', 'displayName', 'email', 'profilePhoto', 'status'] }
      ]
    });
  }

  async findConversationsForUser(userId) {
    return await DirectConversation.findAll({
      where: {
        [Op.or]: [
          { user1_id: userId },
          { user2_id: userId }
        ]
      },
      include: [
        { model: User, as: 'user1', attributes: ['id', 'displayName', 'email', 'profilePhoto', 'status'] },
        { model: User, as: 'user2', attributes: ['id', 'displayName', 'email', 'profilePhoto', 'status'] }
      ],
      order: [['last_message_at', 'DESC']]
    });
  }

  async findConversationById(id) {
    return await DirectConversation.findByPk(id, {
      include: [
        { model: User, as: 'user1', attributes: ['id', 'displayName', 'email', 'profilePhoto', 'status'] },
        { model: User, as: 'user2', attributes: ['id', 'displayName', 'email', 'profilePhoto', 'status'] }
      ]
    });
  }

  async createConversation(user1_id, user2_id) {
    const conv = await DirectConversation.create({
      user1_id,
      user2_id,
      last_message: 'Conversa iniciada',
      last_message_at: new Date()
    });
    return await this.findConversationById(conv.id);
  }

  async updateConversationLastMessage(id, last_message, last_message_at = new Date()) {
    const conv = await DirectConversation.findByPk(id);
    if (!conv) return null;
    return await conv.update({ last_message, last_message_at });
  }

  async deleteConversation(id) {
    await DirectMessage.destroy({ where: { conversation_id: id } });
    return await DirectConversation.destroy({ where: { id } });
  }

  /**
   * Histórico de uma conversa direta com paginação por cursor (mesma lógica das salas).
   * @returns {{ messages: Array, hasMore: boolean, nextCursor: Date|null }}
   */
  async findMessagesByConversation(conversationId, { limit = 50, before = null, since = null } = {}) {
    const pageSize = Number(limit);
    const whereClause = { conversation_id: conversationId };

    if (since) {
      // Modo sincronização: mensagens mais novas que `since`, já em ordem cronológica.
      whereClause.created_at = { [Op.gt]: new Date(since) };
      const newer = await DirectMessage.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'sender', attributes: ['id', 'displayName', 'email', 'profilePhoto'] }
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

    const found = await DirectMessage.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'displayName', 'email', 'profilePhoto'] }
      ],
      order: [['created_at', 'DESC']],
      limit: pageSize + 1
    });

    const hasMore = found.length > pageSize;
    const messages = hasMore ? found.slice(0, pageSize) : found;
    messages.reverse();

    const nextCursor = hasMore && messages.length > 0 ? messages[0].created_at : null;

    return { messages, hasMore, nextCursor, nextSince: null };
  }

  async createMessage(data) {
    const msg = await DirectMessage.create(data);
    const preview = String(data.content || '').startsWith('e2ee:')
      ? 'Mensagem criptografada'
      : (data.content || (data.attachment_url ? 'Anexo compartilhado' : 'Foto compartilhada'));
    await this.updateConversationLastMessage(data.conversation_id, preview, new Date());
    return await DirectMessage.findByPk(msg.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'displayName', 'email', 'profilePhoto'] }
      ]
    });
  }
}

module.exports = new DirectRepository();
