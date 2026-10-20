const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Room = require('./Room');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  room_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Room,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  attachment_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  attachment_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  attachment_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  attachment_size: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'messages',
  timestamps: false,
  indexes: [
    {
      // Histórico paginado: filtra por sala e ordena pela data (mais nova primeiro)
      name: 'idx_messages_room_created_at',
      fields: ['room_id', { name: 'created_at', order: 'DESC' }]
    }
  ]
});

Room.hasMany(Message, { foreignKey: 'room_id', as: 'messages', onDelete: 'CASCADE' });
Message.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });

User.hasMany(Message, { foreignKey: 'user_id', as: 'messages', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Message;
