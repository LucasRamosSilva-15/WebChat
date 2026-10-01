const sequelize = require('../config/database');
const User = require('./User');
const Room = require('./Room');
const Message = require('./Message');
const Report = require('./Report');
const Feedback = require('./Feedback');
const RoomMember = require('./RoomMember');

User.belongsToMany(Room, { through: RoomMember, foreignKey: 'user_id' });
Room.belongsToMany(User, { through: RoomMember, foreignKey: 'room_id' });
User.hasMany(RoomMember, { foreignKey: 'user_id' });
RoomMember.belongsTo(User, { foreignKey: 'user_id' });
Room.hasMany(RoomMember, { foreignKey: 'room_id' });
RoomMember.belongsTo(Room, { foreignKey: 'room_id' });

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
  Feedback,
  RoomMember
};
