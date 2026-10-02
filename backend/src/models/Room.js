const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'public',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'owner_id',
    references: {
      model: User,
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'rooms',
  timestamps: false
});

User.hasMany(Room, { foreignKey: 'created_by', as: 'rooms' });
Room.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

module.exports = Room;
