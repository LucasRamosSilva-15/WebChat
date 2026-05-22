const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  maxHttpBufferSize: 1e8 // Tamanho Maximo de 100 MB
});

const socketUsers = new Map();

function getUniqueRoomCount(io, roomName) {
  const socketsInRoom = io.sockets.adapter.rooms.get(roomName);
  if (!socketsInRoom) return 0;

  const uniqueUsers = new Set();
  for (const sid of socketsInRoom) {
    uniqueUsers.add(socketUsers.get(sid) || sid);
  }
  return uniqueUsers.size;
}

io.on('connection', (socket) => {
  console.log('Um usuário se conectou:', socket.id);

  const broadcastRoomCounts = () => {
    const counts = {};
    for (const [room, set] of io.sockets.adapter.rooms.entries()) {
      if (!io.sockets.sockets.has(room)) {
        counts[room] = getUniqueRoomCount(io, room);
      }
    }
    io.emit('all_rooms_counts', counts);
  };

  socket.on('request_all_rooms_counts', () => {
    broadcastRoomCounts();
  });

  socket.on('join_room', (data) => {
    if (data.userId) {
      socketUsers.set(socket.id, data.userId);
    }

    const currentRoomCount = getUniqueRoomCount(io, data.room);

    if (currentRoomCount >= 200 && !socket.rooms.has(data.room)) {
      socket.emit('room_full_error', { message: 'A sala atingiu o limite máximo de 200 membros.' });
      return;
    }

    socket.join(data.room);
    console.log(`Usuário com ID: ${socket.id} entrou na sala: ${data.room}`);
    const newCount = getUniqueRoomCount(io, data.room);
    io.to(data.room).emit('active_users_count', newCount);
    broadcastRoomCounts();
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('read_message', (data) => {
    socket.to(data.room).emit('message_read', data);
  });

  socket.on('delete_message', (data) => {
    socket.to(data.room).emit('message_deleted', data);
  });

  socket.on('edit_message', (data) => {
    socket.to(data.room).emit('message_edited', data);
  });

  socket.on('toggle_like', (data) => {
    socket.to(data.room).emit('like_toggled', data);
  });

  socket.on('private_invite', (data) => {
    let targetSocketId = null;
    for (const [sid, uid] of socketUsers.entries()) {
      if (uid === data.to) {
        targetSocketId = sid;
        break;
      }
    }
    if (targetSocketId) {
      io.to(targetSocketId).emit('receive_private_invite', data);
    }
  });

  socket.on('disconnecting', () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        const socketsInRoom = io.sockets.adapter.rooms.get(room);
        let newCount = 0;
        if (socketsInRoom) {
          const uniqueUsers = new Set();
          for (const sid of socketsInRoom) {
            if (sid !== socket.id) {
              uniqueUsers.add(socketUsers.get(sid) || sid);
            }
          }
          newCount = uniqueUsers.size;
        }
        io.to(room).emit('active_users_count', newCount);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuário se desconectou:', socket.id);
    socketUsers.delete(socket.id);
    broadcastRoomCounts();
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});