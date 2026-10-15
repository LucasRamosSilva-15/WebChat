const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const DirectConversation = sequelize.define('DirectConversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user1_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  user2_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  last_message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  last_message_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'direct_conversations',
  timestamps: false
});

module.exports = DirectConversation;
