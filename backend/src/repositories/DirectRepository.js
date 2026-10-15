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

  async findMessagesByConversation(conversationId) {
    return await DirectMessage.findAll({
      where: { conversation_id: conversationId },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'displayName', 'email', 'profilePhoto'] }
      ],
      order: [['created_at', 'ASC']]
    });
  }

  async createMessage(data) {
    const msg = await DirectMessage.create(data);
    await this.updateConversationLastMessage(data.conversation_id, data.content || 'Foto compartilhada', new Date());
    return await DirectMessage.findByPk(msg.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'displayName', 'email', 'profilePhoto'] }
      ]
    });
  }
}

module.exports = new DirectRepository();
