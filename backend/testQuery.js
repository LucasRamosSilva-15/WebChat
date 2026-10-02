require('dotenv').config();
const { sequelize } = require('./src/models/index');
const RoomService = require('./src/services/RoomService');

async function testQuery() {
  try {
    const room = await RoomService.getRoomById('8c54784a-93cb-4fbc-b40b-da0d252bb88a'); // Try finding any room
    console.log(room);
    process.exit(0);
  } catch (error) {
    const [rooms] = await sequelize.query('SELECT * FROM rooms LIMIT 1');
    const firstId = rooms[0]?.id;
    if (firstId) {
      const room = await RoomService.getRoomById(firstId);
      console.log('Room from service:', room);
    }
    process.exit(0);
  }
}
testQuery();
