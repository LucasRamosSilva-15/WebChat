const sequelize = require('../config/database');
const User = require('./User');
const Room = require('./Room');
const Message = require('./Message');
const Report = require('./Report');
const Feedback = require('./Feedback');

const initModels = async () => {
  try {
    await sequelize.authenticate();
    console.log('[Sequelize] Conexão com o banco de dados estabelecida com sucesso.');

  } catch (error) {
    console.error('[Sequelize] Não foi possível conectar ao banco de dados:', error);
  }
};

module.exports = {
  sequelize,
  initModels,
  User,
  Room,
  Message,
  Report,
  Feedback
};
