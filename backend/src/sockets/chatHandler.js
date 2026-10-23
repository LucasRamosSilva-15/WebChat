const { createClient } = require('@supabase/supabase-js');
const { Message } = require('../models');
const { validateAttachment } = require('../utils/attachments');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('[SERVER] SUPABASE_URL carregada:', !!supabaseUrl);
console.log('[SERVER] SUPABASE_KEY carregada:', !!supabaseKey);

const supabase = createClient(
  supabaseUrl || 'http://placeholder',
  supabaseKey || 'placeholder'
);

const messageRateLimits = new Map();

const registerChatHandlers = (io, socket) => {
  socket.on('send_message', async (data) => {
    console.log('[DEBUG] Recebido send_message:', data);
    const { room, userId, userName, sender_name, content, imageUrl, attachment } = data;
    const authorName = userName || sender_name || data.author || data.user?.displayName || data.user?.name;
    let validAttachment = null;
    try {
      validAttachment = validateAttachment(attachment);
    } catch (attErr) {
      socket.emit('message_error', { error: attErr.message });
      return;
    }

    if (!room || (!content && !imageUrl && !validAttachment)) {
      console.log('[DEBUG] send_message ignorado por falta de dados (room, content ou imageUrl)');
      return;
    }

    const isE2EE = typeof content === 'string' && content.startsWith('e2ee:v1:');
    if (isE2EE && content.length > 9 * 1024 * 1024) {
      socket.emit('message_error', { error: 'A mensagem criptografada excede o tamanho máximo.' });
      return;
    }
    if (!isE2EE && content && typeof content === 'string' && content.length > 1000) {
      socket.emit('message_error', { error: 'A mensagem excede o limite máximo de 1.000 caracteres.' });
      return;
    }

    const now = Date.now();
    const lastMessageTime = messageRateLimits.get(userId) || 0;
    if (now - lastMessageTime < 500) {
      socket.emit('rate_limit_error', { error: 'Você está enviando mensagens muito rápido. Aguarde um momento.' });
      return;
    }
    messageRateLimits.set(userId, now);

    try {
      const { data: savedMessage, error } = await supabase
        .from('messages')
        .insert([{
          room_id: room,
          user_id: userId,
          user_name: authorName,
          content,
          image_url: imageUrl,
          ...(validAttachment || {})
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro do Supabase ao salvar mensagem:', error);
        socket.emit('message_error', { error: `Erro ao salvar no banco de dados: ${error.message}` });
        return;
      }

      try {
        if (Message && Message.create) {
          await Message.create({
            id: savedMessage?.id,
            room_id: room,
            user_id: userId,
            content,
            image_url: imageUrl,
            ...(validAttachment || {})
          });
        }
      } catch (seqError) {}

      if (savedMessage) {
        const resolvedName = savedMessage.user_name || savedMessage.userName || authorName || 'Usuário';
        const payload = {
          ...savedMessage,
          messageId: data.messageId || savedMessage.id,
          user_name: resolvedName,
          userName: resolvedName,
          sender_name: resolvedName,
          sender: resolvedName
        };
        io.to(room).emit('receive_message', payload);
      }
    } catch (err) {
      console.error('Falha ao processar mensagem via WebSocket:', err);
      socket.emit('message_error', { error: `Falha interna no servidor: ${err.message || 'Erro inesperado'}` });
    }
  });

  socket.on('delete_message', async ({ room, messageId }) => {
    if (!room || !messageId) return;
    try {
      try {
        await supabase
          .from('messages')
          .delete()
          .eq('id', messageId);
      } catch (sbErr) {}

      try {
        if (Message && Message.destroy) {
          await Message.destroy({ where: { id: messageId } });
        }
      } catch (seqError) {}

      try {
        const { DirectMessage } = require('../models');
        if (DirectMessage && DirectMessage.destroy) {
          await DirectMessage.destroy({ where: { id: messageId } });
        }
      } catch (directErr) {}

      io.to(room).emit('message_deleted', { messageId });
    } catch (err) {
      console.error('Falha ao apagar mensagem via WebSocket:', err);
    }
  });

  socket.on('edit_message', async ({ room, messageId, message, time }) => {
    if (!room || !messageId) return;
    try {
      const { error } = await supabase
        .from('messages')
        .update({ content: message })
        .eq('id', messageId);

      if (error) {
        console.error('Erro ao editar mensagem:', error);
        return;
      }

      try {
        if (Message && Message.update) {
          await Message.update({ content: message }, { where: { id: messageId } });
        }
      } catch (seqError) {}

      io.to(room).emit('message_edited', { messageId, message });
    } catch (err) {
      console.error('Falha ao editar mensagem via WebSocket:', err);
    }
  });

  socket.on('toggle_like', ({ room, messageId, userId }) => {
    if (!room || !messageId || !userId) return;
    socket.to(room).emit('like_toggled', { messageId, userId });
  });
};

module.exports = {
  supabase,
  messageRateLimits,
  registerChatHandlers
};
