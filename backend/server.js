require('dotenv').config(); 
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path'); 
const apiRoutes = require('./src/routes/api');
const { createClient } = require('@supabase/supabase-js');
 
const app = express();
 
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
 
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
console.log(
  `[SWAGGER] ${Object.keys(swaggerDocs.paths || {}).length} rota(s) encontrada(s):`,
  Object.keys(swaggerDocs.paths || {})
);
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
 
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
 
app.use('/api', apiRoutes);
 
app.get('/', (req, res) => {
  res.json({ status: 'online', service: 'WebChat MVP API' });
});
 
const server = http.createServer(app);
 
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});
 
const supabase = createClient(
  process.env.SUPABASE_URL || 'http://placeholder',
  process.env.SUPABASE_KEY || 'placeholder'
);
 
const roomConnections = new Map(); 
 
io.on('connection', (socket) => {
 
  socket.on('join_room', ({ room, userId }) => {
    if (!room || !userId) return;
 
    socket.join(room);
    socket.currentRoom = room;
    socket.userId = userId;
 
    if (!roomConnections.has(room)) {
      roomConnections.set(room, new Set());
    }
    roomConnections.get(room).add(userId);
 
    io.to(room).emit('active_users_count', roomConnections.get(room).size);
  });
 
  socket.on('send_message', async (data) => {
    const { room, userId, userName, content, imageUrl } = data;
    if (!room || !content) return;
 
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
    const room = socket.currentRoom;
    const userId = socket.userId;
 
    if (room && userId && roomConnections.has(room)) {
      const usersInRoom = roomConnections.get(room);
      usersInRoom.delete(userId);
 
      if (usersInRoom.size === 0) {
        roomConnections.delete(room);
      } else {
        io.to(room).emit('active_users_count', usersInRoom.size);
      }
    }
  });
});
 
const PORT = process.env.PORT || 3001;
 
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`[SERVER] Rodando na porta ${PORT}`);
  });
}
 
module.exports = { app, server };