require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const apiRoutes = require('./src/routes/api');
const { createClient } = require('@supabase/supabase-js');

const app = express();

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

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("[SERVER] SUPABASE_URL carregada:", !!supabaseUrl);
console.log("[SERVER] SUPABASE_KEY carregada:", !!supabaseKey);

const supabase = createClient(
  // process.env.SUPABASE_URL || 'http://placeholder',
  // process.env.SUPABASE_KEY || 'placeholder'
  supabaseUrl || 'http://placeholder',
  supabaseKey || 'placeholder'
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