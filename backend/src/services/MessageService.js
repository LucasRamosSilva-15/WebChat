const MessageRepository = require('../repositories/MessageRepository');

class MessageService {
  async sendMessage(roomId, userId, content) {
    if (!content || content.trim() === '') {
      throw new Error('O conteúdo da mensagem não pode estar vazio.');
    }

    const newMessage = await MessageRepository.create({
      room_id: roomId,
      user_id: userId,
      content
    });

    return newMessage;
  }

  async getMessagesByRoom(roomId) {
    if (!roomId) {
      throw new Error('ID da sala é obrigatório.');
    }
    return await MessageRepository.findByRoomId(roomId);
  }

  async deleteMessage(id, userId, isAdmin) {
    const message = await MessageRepository.findById(id);
    if (!message) throw new Error('Mensagem não encontrada.');

    // Apenas quem enviou a mensagem ou um admin pode deletar
    if (message.user_id !== userId && !isAdmin) {
      throw new Error('Você não tem permissão para deletar esta mensagem.');
    }

    await MessageRepository.delete(id);
    return { success: true };
  }
}

module.exports = new MessageService();
