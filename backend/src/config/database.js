const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../../.env' }); // Carrega as variáveis se for executado diretamente

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Necessário para a maioria das nuvens como o Supabase
    }
  },
  logging: false, // Define como true se quiser ver os SQLs sendo gerados no terminal
});

module.exports = sequelize;
