const DirectRepository = require('../repositories/DirectRepository');
const UserRepository = require('../repositories/UserRepository');

class DirectService {
  async listConversations(userId) {
    if (!userId) {
      throw new Error('Usuário não autenticado.');
    }

    const convs = await DirectRepository.findConversationsForUser(userId);

    return convs.map(conv => {
      const partner = conv.user1_id === userId ? conv.user2 : conv.user1;
      const partnerName = partner?.displayName || (partner?.email ? partner.email.split('@')[0] : 'Usuário');

      let timeFormatted = 'Agora';
      if (conv.last_message_at) {
        try {
          const date = new Date(conv.last_message_at);
          timeFormatted = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
          timeFormatted = 'Agora';
        }
      }

      return {
        id: conv.id,
        partnerId: partner?.id || null,
        name: partnerName,
        username: partnerName.toLowerCase().replace(/\s+/g, '_'),
        avatar: partner?.profilePhoto || null,
        lastMessage: conv.last_message || 'Conversa iniciada',
        time: timeFormatted,
        online: partner?.status === 'active',
        unread: 0
      };
    });
  }

  async getOrCreateConversation(userId, targetUserId) {
    if (!userId) {
      throw new Error('Usuário não autenticado.');
    }
    if (!targetUserId) {
      throw new Error('ID do destinatário é obrigatório.');
    }
    if (userId === targetUserId) {
      throw new Error('Não é possível iniciar conversa consigo mesmo.');
    }

    const targetUser = await UserRepository.findById(targetUserId);
    if (!targetUser) {
      throw new Error('Destinatário não encontrado.');
    }

    let conv = await DirectRepository.findConversationBetween(userId, targetUserId);
    if (!conv) {
      conv = await DirectRepository.createConversation(userId, targetUserId);
    }

    const partner = conv.user1_id === userId ? conv.user2 : conv.user1;
    const partnerName = partner?.displayName || (partner?.email ? partner.email.split('@')[0] : 'Usuário');

    return {
      id: conv.id,
      partnerId: partner?.id || targetUserId,
      name: partnerName,
      username: partnerName.toLowerCase().replace(/\s+/g, '_'),
      avatar: partner?.profilePhoto || null,
      lastMessage: conv.last_message || 'Conversa iniciada',
      time: 'Agora',
      online: partner?.status === 'active',
      unread: 0
    };
  }

  async getConversationMessages(conversationId, userId) {
    if (!userId) {
      throw new Error('Usuário não autenticado.');
    }
    if (!conversationId) {
      throw new Error('ID da conversa é obrigatório.');
    }

    const conv = await DirectRepository.findConversationById(conversationId);
    if (!conv) {
      throw new Error('Conversa não encontrada.');
    }

    if (conv.user1_id !== userId && conv.user2_id !== userId) {
      throw new Error('Sem permissão para acessar esta conversa.');
    }

    const rawMessages = await DirectRepository.findMessagesByConversation(conversationId);

    return rawMessages.map(msg => {
      let timeFormatted = '';
      if (msg.created_at) {
        try {
          timeFormatted = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
          timeFormatted = '';
        }
      }

      return {
        messageId: msg.id,
        sender: msg.sender?.displayName || 'Usuário',
        text: msg.content || '',
        time: timeFormatted,
        isMe: msg.sender_id === userId,
        image: msg.image_url || null
      };
    });
  }

  async sendMessage(conversationId, senderId, content, imageUrl) {
    if (!senderId) {
      throw new Error('Usuário não autenticado.');
    }
    if (!conversationId) {
      throw new Error('ID da conversa é obrigatório.');
    }
    if (!content && !imageUrl) {
      throw new Error('Mensagem ou imagem é obrigatória.');
    }

    const conv = await DirectRepository.findConversationById(conversationId);
    if (!conv) {
      throw new Error('Conversa não encontrada.');
    }

    if (conv.user1_id !== senderId && conv.user2_id !== senderId) {
      throw new Error('Sem permissão para enviar mensagem nesta conversa.');
    }

    const newMsg = await DirectRepository.createMessage({
      conversation_id: conversationId,
      sender_id: senderId,
      content: content || '',
      image_url: imageUrl || null
    });

    let timeFormatted = 'Agora';
    if (newMsg.created_at) {
      try {
        timeFormatted = new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch {
        timeFormatted = 'Agora';
      }
    }

    return {
      messageId: newMsg.id,
      sender: newMsg.sender?.displayName || 'Usuário',
      text: newMsg.content || '',
      time: timeFormatted,
      isMe: true,
      image: newMsg.image_url || null
    };
  }

  async deleteConversation(conversationId, userId) {
    if (!userId) {
      throw new Error('Usuário não autenticado.');
    }

    const conv = await DirectRepository.findConversationById(conversationId);
    if (!conv) {
      throw new Error('Conversa não encontrada.');
    }

    if (conv.user1_id !== userId && conv.user2_id !== userId) {
      throw new Error('Sem permissão para excluir esta conversa.');
    }

    await DirectRepository.deleteConversation(conversationId);
    return { success: true };
  }

  async searchAvailableUsers(currentUserId, query = '') {
    const allUsers = await UserRepository.findAll();
    const cleanQuery = query.toLowerCase().trim();

    return allUsers
      .filter(u => u.id !== currentUserId)
      .filter(u => {
        if (!cleanQuery) return true;
        const name = (u.displayName || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        return name.includes(cleanQuery) || email.includes(cleanQuery);
      })
      .map(u => ({
        id: u.id,
        name: u.displayName || u.email.split('@')[0],
        email: u.email,
        avatar: u.profilePhoto || null,
        status: u.status || 'active'
      }));
  }
}

module.exports = new DirectService();
