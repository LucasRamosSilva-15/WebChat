const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoomMember = sequelize.define('RoomMember', {
  room_id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'room_members',
  timestamps: false
});

module.exports = RoomMember;
