const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

const sequelize = isTest
  ? new Sequelize('sqlite::memory:', { logging: false })
  : new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
  });

module.exports = sequelize;
