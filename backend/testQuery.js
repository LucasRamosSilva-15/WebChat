require('dotenv').config();
const { sequelize } = require('./src/models/index');

async function testQuery() {
  try {
    const [msgs] = await sequelize.query('SELECT * FROM messages LIMIT 1');
    console.log('Message columns:', Object.keys(msgs[0] || {}));
    process.exit(0);
  } catch (error) {
    console.error('Error fetching:', error);
    process.exit(1);
  }
}
testQuery();
