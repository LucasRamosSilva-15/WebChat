const MessageRepository = require('../repositories/MessageRepository');
const { sanitizeText } = require('../utils/security');

class MessageService {
  async sendMessage(roomId, userId, content, imageUrl) {
    const cleanContent = content ? sanitizeText(content) : content;

    if ((!cleanContent || cleanContent.trim() === '') && !imageUrl) {
      throw new Error('O conteúdo da mensagem ou a imagem não podem estar vazios.');
    }

    if (cleanContent && cleanContent.length > 1000) {
      throw new Error('A mensagem excede o limite máximo de 1.000 caracteres.');
    }

    const newMessage = await MessageRepository.create({
      room_id: roomId,
      user_id: userId,
      content: cleanContent,
      image_url: imageUrl
    });

    return newMessage;
  }

  async getMessagesByRoom(roomId) {
    if (!roomId) {
      throw new Error('ID da sala é obrigatório.');
    }
    return await MessageRepository.findByRoomId(roomId);
  }

  async searchMessages(roomId, query) {
    if (!roomId) throw new Error('ID da sala é obrigatório.');
    if (!query) throw new Error('Termo de busca é obrigatório.');
    return await MessageRepository.searchByRoom(roomId, sanitizeText(query));
  }

  async deleteMessage(id, userId, isAdmin) {
    const message = await MessageRepository.findById(id);
    if (!message) throw new Error('Mensagem não encontrada.');

    if (message.user_id !== userId && !isAdmin) {
      throw new Error('Você não tem permissão para deletar esta mensagem.');
    }

    await MessageRepository.delete(id);
    return { success: true };
  }
}

module.exports = new MessageService();
