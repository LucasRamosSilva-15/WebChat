const jwt = require('jsonwebtoken');
const { sequelize, User, Room, Message } = require('../src/models');

const SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Recria todas as tabelas no SQLite em memória (banco limpo a cada teste).
const resetDb = () => sequelize.sync({ force: true });

const closeDb = () => sequelize.close();

const createUser = (overrides = {}) =>
  User.create({
    email: `user${Math.random().toString(36).slice(2)}@test.com`,
    password: 'hash-qualquer',
    displayName: 'Usuário Teste',
    ...overrides
  });

const createRoom = (userId, overrides = {}) =>
  Room.create({ name: 'Sala Teste', created_by: userId, ...overrides });

const createMessage = (roomId, userId, overrides = {}) =>
  Message.create({ room_id: roomId, user_id: userId, content: 'olá', ...overrides });

const tokenFor = (userId) => jwt.sign({ id: userId }, SECRET, { expiresIn: '1h' });
const adminToken = () => jwt.sign({ id: 'admin-system', role: 'admin' }, SECRET, { expiresIn: '1h' });
const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

module.exports = { resetDb, closeDb, createUser, createRoom, createMessage, tokenFor, adminToken, authHeader };
