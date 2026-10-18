require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { initSockets, globalOnlineUsers } = require('./src/sockets');
const { initModels, sequelize } = require('./src/models');

const server = http.createServer(app);
const io = initSockets(server);

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {
  initModels();
  server.listen(PORT, () => {
    console.log(`[SERVER] Rodando na porta ${PORT}`);
  });
}

module.exports = {
  app,
  server,
  io,
  sequelize,
  initModels,
  globalOnlineUsers
};