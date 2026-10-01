const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../../.env' }); // Carrega as variáveis se for executado diretamente

// Em testes (NODE_ENV=test, definido automaticamente pelo Jest) usamos um SQLite em memória,
// assim os testes não dependem do PostgreSQL/Supabase nem sujam o banco real.
const sequelize = process.env.NODE_ENV === 'test'
  ? new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    })
  : new Sequelize(process.env.DATABASE_URL, {
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
