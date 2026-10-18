const { verifyToken } = require('../utils/security');

const socketAuthMiddleware = (socket, next) => {
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
};

module.exports = socketAuthMiddleware;
