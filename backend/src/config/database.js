const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../../.env' }); // Carrega as variáveis se for executado diretamente

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
