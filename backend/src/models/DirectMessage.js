const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const DirectConversation = require('./DirectConversation');

const DirectMessage = sequelize.define('DirectMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  conversation_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: DirectConversation,
      key: 'id'
    }
  },
  sender_id: {
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
  tableName: 'direct_messages',
  timestamps: false,
  indexes: [
    {
      name: 'idx_direct_messages_conv_created_at',
      fields: ['conversation_id', { name: 'created_at', order: 'DESC' }]
    }
  ]
});

module.exports = DirectMessage;
