const roomPresence = new Map();
const globalOnlineUsers = new Map();

const handleLeaveOrDisconnect = (io, socketId, roomId, userId) => {
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

const handleUserConnect = (io, socket) => {
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
};

const handleJoinRoom = (io, socket, { roomId, user }) => {
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
};

const handleLeaveRoom = (io, socket, { roomId, userId }) => {
  socket.leave(roomId);
  handleLeaveOrDisconnect(io, socket.id, roomId, userId);
};

const handleUserDisconnect = (io, socket) => {
  handleLeaveOrDisconnect(io, socket.id, socket.currentRoom, socket.userId);
  const uid = socket.userId || socket.user?.id;
  if (uid && globalOnlineUsers.has(uid)) {
    const userSockets = globalOnlineUsers.get(uid);
    userSockets.delete(socket.id);
    if (userSockets.size === 0) {
      globalOnlineUsers.delete(uid);
      io.emit('user_presence_changed', { userId: uid, isOnline: false });
    }
  }
};

module.exports = {
  roomPresence,
  globalOnlineUsers,
  handleLeaveOrDisconnect,
  handleUserConnect,
  handleJoinRoom,
  handleLeaveRoom,
  handleUserDisconnect
};
