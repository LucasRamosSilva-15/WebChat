const { Sequelize } = require('sequelize');
const { User } = require('../src/models');

let testDb;

beforeAll(async () => {
  testDb = new Sequelize('sqlite::memory:', { logging: false });
  User.init(User.getAttributes(), { sequelize: testDb, tableName: 'users', timestamps: false });
  await testDb.sync({ force: true });
});

afterAll(async () => {
  await testDb.close();
});

describe('Model de User', () => {
  it('Deve criar um usuário com sucesso', async () => {
    const user = await User.create({
      email: 'teste@email.com',
      password: 'senha_criptografada',
      displayName: 'Lucas Teste'
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe('teste@email.com');
    expect(user.displayName).toBe('Lucas Teste');
  });

  it('Não deve criar usuário sem email (Regra do Banco)', async () => {
    await expect(User.create({
      password: 'senha_criptografada',
      displayName: 'Sem Email'
    })).rejects.toThrow();
  });

  it('Não deve permitir emails duplicados', async () => {
    await User.create({ email: 'duplicado@email.com' });
    await expect(User.create({ email: 'duplicado@email.com' })).rejects.toThrow();
  });
});
