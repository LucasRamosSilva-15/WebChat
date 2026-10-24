const { Server } = require('socket.io');
const { corsOptions } = require('../config/cors');
const socketAuthMiddleware = require('./socketAuth');
const {
  globalOnlineUsers,
  roomPresence,
  handleUserConnect,
  handleJoinRoom,
  handleLeaveRoom,
  handleUserDisconnect
} = require('./presence');
const { registerChatHandlers } = require('./chatHandler');

const initSockets = (server) => {
  const io = new Server(server, {
    cors: corsOptions,
    maxHttpBufferSize: 1e7
  });

  global.io = io;
  global.globalOnlineUsers = globalOnlineUsers;

  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    handleUserConnect(io, socket);

    socket.on('get_online_users', () => {
      socket.emit('online_users_list', Array.from(globalOnlineUsers.keys()));
    });

    socket.on('joinRoom', (payload) => {
      handleJoinRoom(io, socket, payload);
    });

    socket.on('join_room', (payload) => {
      const roomId = payload?.roomId || payload?.room;
      const user = payload?.user || {
        id: payload?.userId || socket.user?.id,
        name: payload?.userName || payload?.displayName || socket.user?.displayName || 'Usuário',
        email: payload?.email || socket.user?.email
      };
      handleJoinRoom(io, socket, { roomId, user });
    });

    socket.on('leaveRoom', (payload) => {
      handleLeaveRoom(io, socket, payload);
    });

    socket.on('leave_room', (payload) => {
      const roomId = payload?.roomId || payload?.room;
      const userId = payload?.userId || socket.user?.id;
      handleLeaveRoom(io, socket, { roomId, userId });
    });

    registerChatHandlers(io, socket);

    socket.on('disconnect', () => {
      handleUserDisconnect(io, socket);
    });
  });

  return io;
};

module.exports = {
  initSockets,
  globalOnlineUsers,
  roomPresence
};
