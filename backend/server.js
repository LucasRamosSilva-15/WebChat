require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const path = require('path');
const apiRoutes = require('./src/routes/api');
const { createClient } = require('@supabase/supabase-js');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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

app.use(helmet());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'online', service: 'WebChat MVP API' });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin === process.env.FRONTEND_URL) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
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

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Erro de Autenticação: Token não fornecido'));
  }
  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, decoded) => {
    if (err) return next(new Error('Erro de Autenticação: Token inválido'));
    socket.user = decoded;
    next();
  });
});

io.on('connection', (socket) => {

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
    socket.currentRoom = roomId;
    socket.userId = user.id;

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
    const { room, userId, userName, content, imageUrl } = data;
    if (!room || (!content && !imageUrl)) return;

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
          user_name: userName,
          content,
          image_url: imageUrl
        }])
        .select()
        .single();

      if (!error && savedMessage) {
        io.to(room).emit('receive_message', savedMessage);
      }
    } catch (err) {
      console.error('Falha ao processar mensagem via WebSocket:', err);
    }
  });

  socket.on('disconnect', () => {
    handleLeaveOrDisconnect(socket.id, socket.currentRoom, socket.userId);
  });
});

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`[SERVER] Rodando na porta ${PORT}`);
  });
}

module.exports = { app, server };