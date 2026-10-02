const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Message = require('./Message');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  message_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Message,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'reporter_id',
    references: {
      model: User,
      key: 'id'
    }
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'reports',
  timestamps: false
});

Message.hasMany(Report, { foreignKey: 'message_id', as: 'reports', onDelete: 'CASCADE' });
Report.belongsTo(Message, { foreignKey: 'message_id', as: 'message' });

User.hasMany(Report, { foreignKey: 'user_id', as: 'reports', onDelete: 'CASCADE' });
Report.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Report;
