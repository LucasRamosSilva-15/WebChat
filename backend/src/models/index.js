const sequelize = require('../config/database');
const User = require('./User');
const Room = require('./Room');
const Message = require('./Message');
const Report = require('./Report');
const Feedback = require('./Feedback');
const RoomMember = require('./RoomMember');
const Favorite = require('./Favorite');
const DirectConversation = require('./DirectConversation');
const DirectMessage = require('./DirectMessage');
const Notification = require('./Notification');

User.belongsToMany(Room, { through: RoomMember, foreignKey: 'user_id' });
Room.belongsToMany(User, { through: RoomMember, foreignKey: 'room_id' });
User.hasMany(RoomMember, { foreignKey: 'user_id' });
RoomMember.belongsTo(User, { foreignKey: 'user_id' });
Room.hasMany(RoomMember, { foreignKey: 'room_id' });
RoomMember.belongsTo(Room, { foreignKey: 'room_id' });

User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites', onDelete: 'CASCADE' });
Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(DirectConversation, { foreignKey: 'user1_id', as: 'initiatedConversations' });
User.hasMany(DirectConversation, { foreignKey: 'user2_id', as: 'receivedConversations' });
DirectConversation.belongsTo(User, { foreignKey: 'user1_id', as: 'user1' });
DirectConversation.belongsTo(User, { foreignKey: 'user2_id', as: 'user2' });

DirectConversation.hasMany(DirectMessage, { foreignKey: 'conversation_id', as: 'messages', onDelete: 'CASCADE' });
DirectMessage.belongsTo(DirectConversation, { foreignKey: 'conversation_id', as: 'conversation' });
DirectMessage.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

const initModels = async () => {
  try {
    await sequelize.authenticate();
    console.log('[Sequelize] Conexão com o banco de dados estabelecida com sucesso.');
    if (process.env.NODE_ENV !== 'test') {
      await sequelize.sync();
      try {
        await sequelize.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS public_key TEXT;');
        await sequelize.query('ALTER TABLE messages ADD COLUMN IF NOT EXISTS attachment_url TEXT;');
        await sequelize.query('ALTER TABLE messages ADD COLUMN IF NOT EXISTS attachment_type VARCHAR(100);');
        await sequelize.query('ALTER TABLE messages ADD COLUMN IF NOT EXISTS attachment_name VARCHAR(255);');
        await sequelize.query('ALTER TABLE messages ADD COLUMN IF NOT EXISTS attachment_size INTEGER;');
        await sequelize.query('ALTER TABLE direct_messages ADD COLUMN IF NOT EXISTS attachment_url TEXT;');
        await sequelize.query('ALTER TABLE direct_messages ADD COLUMN IF NOT EXISTS attachment_type VARCHAR(100);');
        await sequelize.query('ALTER TABLE direct_messages ADD COLUMN IF NOT EXISTS attachment_name VARCHAR(255);');
        await sequelize.query('ALTER TABLE direct_messages ADD COLUMN IF NOT EXISTS attachment_size INTEGER;');
      } catch (colErr) {
        console.warn('[Sequelize] Aviso ao sincronizar colunas adicionais:', colErr.message);
      }
      console.log('[Sequelize] Tabelas verificadas/sincronizadas com sucesso.');
    }
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
  RoomMember,
  Favorite,
  DirectConversation,
  DirectMessage,
  Notification
};
