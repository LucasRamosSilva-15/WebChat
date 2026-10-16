require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const { verifyToken, isAllowedOrigin } = require('./src/utils/security');
const path = require('path');
const apiRoutes = require('./src/routes/api');
const adminRoutes = require('./src/routes/admin');
const { createClient } = require('@supabase/supabase-js');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { initModels } = require('./src/models');

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'WebChat API - Backend',
      version: '1.0.0',
      description: 'API RESTful para gerenciamento do WebChat.',
    },
    servers: [
      { url: 'https://webchat-9vqr.onrender.com/api', description: 'Produção (Render)' },
      { url: 'http://localhost:3001/api', description: 'Local' }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    }
  },
  apis: [path.join(__dirname, 'src', 'routes', '*.js').replace(/\\/g, '/')],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log('[SWAGGER] Procurando arquivos em:', swaggerOptions.apis[0]);
console.log(`[SWAGGER] ${Object.keys(swaggerDocs.paths || {}).length} rota(s) encontrada(s)`);

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const corsOptions = {
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin, process.env.FRONTEND_URL)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const globalApiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 600,
  message: { error: 'Limite de requisições excedido. Tente novamente mais tarde.' },
  skip: () => process.env.NODE_ENV === 'test'
});
app.use('/api', globalApiLimiter);

app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'online', service: 'WebChat MVP API' });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions,
  maxHttpBufferSize: 1e7
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("[SERVER] SUPABASE_URL carregada:", !!supabaseUrl);
console.log("[SERVER] SUPABASE_KEY carregada:", !!supabaseKey);

const supabase = createClient(
  supabaseUrl || 'http://placeholder',
  supabaseKey || 'placeholder'
);

const roomPresence = new Map();
const messageRateLimits = new Map();
const globalOnlineUsers = new Map();
global.globalOnlineUsers = globalOnlineUsers;
global.io = io;

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Erro de Autenticação: Token não fornecido'));
  }
  try {
    const decoded = verifyToken(token);
    socket.user = decoded;
    next();
  } catch {
    return next(new Error('Erro de Autenticação: Token inválido'));
  }
});

io.on('connection', (socket) => {
  const authUserId = socket.user?.id;
  if (authUserId) {
    socket.join(`user_${authUserId}`);
    const wasAlreadyOnline = globalOnlineUsers.has(authUserId) && globalOnlineUsers.get(authUserId).size > 0;
    if (!globalOnlineUsers.has(authUserId)) {
      globalOnlineUsers.set(authUserId, new Set());
    }
    globalOnlineUsers.get(authUserId).add(socket.id);
    if (!wasAlreadyOnline) {
      io.emit('user_presence_changed', { userId: authUserId, isOnline: true });
    }
  }

  socket.on('get_online_users', () => {
    socket.emit('online_users_list', Array.from(globalOnlineUsers.keys()));
  });

  const handleLeaveOrDisconnect = (socketId, roomId, userId) => {
    if (!roomId || !userId) return;

    if (roomPresence.has(roomId)) {
      const roomUsers = roomPresence.get(roomId);
      if (roomUsers.has(userId)) {
        const userData = roomUsers.get(userId);
        userData.socketIds.delete(socketId);

        if (userData.socketIds.size === 0) {
          roomUsers.delete(userId);
        }
      }

      if (roomUsers.size === 0) {
        roomPresence.delete(roomId);
      } else {
        const onlineUsers = Array.from(roomUsers.values()).map(u => ({ id: u.id, name: u.name, online: true }));
        io.to(roomId).emit('roomPresenceUpdated', {
          roomId,
          onlineUsers,
          onlineCount: onlineUsers.length
        });
      }
    }
  };

  socket.on('joinRoom', ({ roomId, user }) => {
    if (!roomId || !user || !user.id) return;

    socket.join(roomId);
    socket.join(`user_${user.id}`);
    socket.currentRoom = roomId;
    socket.userId = user.id;

    const wasAlreadyOnline = globalOnlineUsers.has(user.id) && globalOnlineUsers.get(user.id).size > 0;
    if (!globalOnlineUsers.has(user.id)) {
      globalOnlineUsers.set(user.id, new Set());
    }
    globalOnlineUsers.get(user.id).add(socket.id);
    if (!wasAlreadyOnline) {
      io.emit('user_presence_changed', { userId: user.id, isOnline: true });
    }

    if (!roomPresence.has(roomId)) {
      roomPresence.set(roomId, new Map());
    }
    const roomUsers = roomPresence.get(roomId);

    if (!roomUsers.has(user.id)) {
      roomUsers.set(user.id, {
        id: user.id,
        name: user.name,
        email: user.email,
        socketIds: new Set([socket.id])
      });
    } else {
      roomUsers.get(user.id).socketIds.add(socket.id);
    }

    const onlineUsers = Array.from(roomUsers.values()).map(u => ({ id: u.id, name: u.name, online: true }));
    io.to(roomId).emit('roomPresenceUpdated', {
      roomId,
      onlineUsers,
      onlineCount: onlineUsers.length
    });
  });

  socket.on('leaveRoom', ({ roomId, userId }) => {
    socket.leave(roomId);
    handleLeaveOrDisconnect(socket.id, roomId, userId);
  });

  socket.on('send_message', async (data) => {
    console.log('[DEBUG] Recebido send_message:', data);
    const { room, userId, userName, sender_name, content, imageUrl } = data;
    const authorName = userName || sender_name || data.author || data.user?.displayName || data.user?.name;
    if (!room || (!content && !imageUrl)) {
      console.log('[DEBUG] send_message ignorado por falta de dados (room, content ou imageUrl)');
      return;
    }

    if (content && typeof content === 'string' && content.length > 1000) {
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
          image_url: imageUrl
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro do Supabase ao salvar mensagem:', error);
        socket.emit('message_error', { error: `Erro ao salvar no banco de dados: ${error.message}` });
        return;
      }

      if (savedMessage) {
        const resolvedName = savedMessage.user_name || savedMessage.userName || authorName || 'Usuário';
        const payload = {
          ...savedMessage,
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
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        console.error('Erro ao apagar mensagem:', error);
        return;
      }

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

      io.to(room).emit('message_edited', { messageId, message });
    } catch (err) {
      console.error('Falha ao editar mensagem via WebSocket:', err);
    }
  });

  socket.on('toggle_like', ({ room, messageId, userId }) => {
    if (!room || !messageId || !userId) return;
    socket.to(room).emit('like_toggled', { messageId, userId });
  });

  socket.on('disconnect', () => {
    handleLeaveOrDisconnect(socket.id, socket.currentRoom, socket.userId);
    const uid = socket.userId || socket.user?.id;
    if (uid && globalOnlineUsers.has(uid)) {
      const userSockets = globalOnlineUsers.get(uid);
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        globalOnlineUsers.delete(uid);
        io.emit('user_presence_changed', { userId: uid, isOnline: false });
      }
    }
  });
});

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {
  initModels();
  server.listen(PORT, () => {
    console.log(`[SERVER] Rodando na porta ${PORT}`);
  });
}

module.exports = { app, server, globalOnlineUsers };