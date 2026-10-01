const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  images: {
    type: sequelize.getDialect() === 'postgres' ? DataTypes.ARRAY(DataTypes.TEXT) : DataTypes.JSON,
    allowNull: true,
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
  tableName: 'feedbacks',
  timestamps: false
});

User.hasMany(Feedback, { foreignKey: 'user_id', as: 'feedbacks', onDelete: 'CASCADE' });
Feedback.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Feedback;
