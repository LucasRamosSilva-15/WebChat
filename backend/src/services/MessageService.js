const MessageRepository = require('../repositories/MessageRepository');
const RoomMemberRepository = require('../repositories/RoomMemberRepository');
const { sanitizeText } = require('../utils/security');
const { logSecurityEvent } = require('../utils/auditLogger');
const { parseHistoryParams } = require('../utils/pagination');
const { validateAttachment } = require('../utils/attachments');

class MessageService {
  async sendMessage(roomId, userId, content, imageUrl, attachment = null) {
    const cleanContent = content ? sanitizeText(content) : content;
    const validAttachment = validateAttachment(attachment);

    if ((!cleanContent || cleanContent.trim() === '') && !imageUrl && !validAttachment) {
      throw new Error('O conteúdo da mensagem ou a imagem não podem estar vazios.');
    }

    if (cleanContent && cleanContent.length > 1000) {
      throw new Error('A mensagem excede o limite máximo de 1.000 caracteres.');
    }

    const newMessage = await MessageRepository.create({
      room_id: roomId,
      user_id: userId,
      content: cleanContent,
      image_url: imageUrl,
      ...(validAttachment || {})
    });

    return newMessage;
  }

  /**
   * Histórico paginado: { messages, hasMore, nextCursor }.
   * Sanitiza limit (1 a 100) e before (data válida) antes de chegar ao banco.
   */
  async getMessagesByRoom(roomId, { limit, before, since } = {}) {
    if (!roomId) {
      throw new Error('ID da sala é obrigatório.');
    }
    return await MessageRepository.findByRoomId(roomId, parseHistoryParams({ limit, before, since }));
  }

  async searchMessages(roomId, query) {
    if (!roomId) throw new Error('ID da sala é obrigatório.');
    if (!query) throw new Error('Termo de busca é obrigatório.');
    return await MessageRepository.searchByRoom(roomId, sanitizeText(query));
  }

  async deleteMessage(id, userId, isAdmin) {
    const message = await MessageRepository.findById(id);
    if (!message) throw new Error('Mensagem não encontrada.');

    if (message.user_id === userId || isAdmin) {
      await MessageRepository.delete(id);
      if (global.io) {
        global.io.to(message.room_id).emit('message_deleted', { messageId: id });
      }
      return { success: true };
    }

    if (userId) {
      const member = await RoomMemberRepository.findByRoomAndUser(message.room_id, userId);
      const requesterRole = member?.role;

      if (requesterRole === 'owner') {
        await MessageRepository.delete(id);
        if (global.io) {
          global.io.to(message.room_id).emit('message_deleted', { messageId: id });
        }
        logSecurityEvent({
          eventType: 'ROOM_MODERATION_ACTION',
          level: 'INFO',
          actor: { id: userId, role: 'owner' },
          resource: `room:${message.room_id}`,
          action: 'delete_message',
          status: 'SUCCESS',
          details: { messageId: id, authorId: message.user_id }
        });
        return { success: true, moderatedBy: 'owner' };
      }

      if (requesterRole === 'moderator') {
        const authorMember = await RoomMemberRepository.findByRoomAndUser(message.room_id, message.user_id);
        if (authorMember?.role === 'owner') {
          throw new Error('Moderadores não podem apagar mensagens do dono da sala.');
        }
        await MessageRepository.delete(id);
        if (global.io) {
          global.io.to(message.room_id).emit('message_deleted', { messageId: id });
        }
        logSecurityEvent({
          eventType: 'ROOM_MODERATION_ACTION',
          level: 'INFO',
          actor: { id: userId, role: 'moderator' },
          resource: `room:${message.room_id}`,
          action: 'delete_message',
          status: 'SUCCESS',
          details: { messageId: id, authorId: message.user_id }
        });
        return { success: true, moderatedBy: 'moderator' };
      }
    }

    throw new Error('Você não tem permissão para deletar esta mensagem.');
  }
}

module.exports = new MessageService();
