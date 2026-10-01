const { Sequelize } = require('sequelize');
const { Room, User } = require('../src/models');

let testDb;

beforeAll(async () => {
  testDb = new Sequelize('sqlite::memory:', { logging: false });
  
  User.init(User.getAttributes(), { sequelize: testDb, tableName: 'users', timestamps: false });
  Room.init(Room.getAttributes(), { sequelize: testDb, tableName: 'rooms', timestamps: false });
  
  User.hasMany(Room, { foreignKey: 'created_by' });
  Room.belongsTo(User, { foreignKey: 'created_by' });

  await testDb.sync({ force: true });
});

afterAll(async () => {
  await testDb.close();
});

describe('Model de Room', () => {
  let testUser;

  beforeAll(async () => {
    testUser = await User.create({ email: 'criador@sala.com' });
  });

  it('Deve criar uma sala associada a um criador', async () => {
    const room = await Room.create({
      name: 'Sala de Teste',
      type: 'public',
      created_by: testUser.id
    });

    expect(room.id).toBeDefined();
    expect(room.name).toBe('Sala de Teste');
    expect(room.created_by).toBe(testUser.id);
  });

  it('Não deve criar sala sem nome', async () => {
    await expect(Room.create({
      type: 'public',
      created_by: testUser.id
    })).rejects.toThrow();
  });
});
