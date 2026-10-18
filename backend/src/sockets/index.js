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

    socket.on('leaveRoom', (payload) => {
      handleLeaveRoom(io, socket, payload);
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
