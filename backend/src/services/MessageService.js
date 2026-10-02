const MessageRepository = require('../repositories/MessageRepository');

class MessageService {
  async sendMessage(roomId, userId, content, imageUrl) {
    if ((!content || content.trim() === '') && !imageUrl) {
      throw new Error('O conteúdo da mensagem ou a imagem não podem estar vazios.');
    }

    const newMessage = await MessageRepository.create({
      room_id: roomId,
      user_id: userId,
      content,
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
    return await MessageRepository.searchByRoom(roomId, query);
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
