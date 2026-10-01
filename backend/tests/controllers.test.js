// Testes unitários dos Controllers: o Service é mockado, então só testamos
// a ponte HTTP (status, corpo da resposta, try/catch).
jest.mock('../src/services/UserService');
jest.mock('../src/services/RoomService');

const UserService = require('../src/services/UserService');
const RoomService = require('../src/services/RoomService');
const UsuarioController = require('../src/controllers/UsuarioController');
const RoomController = require('../src/controllers/RoomController');
const { statusFromError } = require('../src/controllers/errorHandler');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

afterEach(() => jest.clearAllMocks());

describe('UsuarioController (Service mockado)', () => {
  it('register: chama o service e responde 201 sem a senha', async () => {
    UserService.register.mockResolvedValue({ id: '1', email: 'a@a.com', password: 'hash', displayName: 'A' });
    UserService.login.mockResolvedValue({ token: 'tok' });
    const res = mockRes();

    await UsuarioController.register({ body: { name: 'A', email: 'a@a.com', password: '123' } }, res);

    expect(UserService.register).toHaveBeenCalledWith({ email: 'a@a.com', password: '123', displayName: 'A' });
    expect(res.status).toHaveBeenCalledWith(201);
    const body = res.json.mock.calls[0][0];
    expect(body.token).toBe('tok');
    expect(body.user.password).toBeUndefined();
  });

  it('register: erro do service vira 400 com a mensagem', async () => {
    UserService.register.mockRejectedValue(new Error('E-mail e senha são obrigatórios.'));
    const res = mockRes();

    await UsuarioController.register({ body: {} }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'E-mail e senha são obrigatórios.' });
  });

  it('login: "Credenciais inválidas" vira 401', async () => {
    UserService.login.mockRejectedValue(new Error('Credenciais inválidas.'));
    const res = mockRes();

    await UsuarioController.login({ body: { email: 'a@a.com', password: 'x' } }, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('RoomController (Service mockado)', () => {
  it('create: passa req.body e req.userId para o service', async () => {
    RoomService.createRoom.mockResolvedValue({ id: 'r1', name: 'Geral' });
    const res = mockRes();

    await RoomController.create({ body: { name: 'Geral' }, userId: 'u1' }, res);

    expect(RoomService.createRoom).toHaveBeenCalledWith({ name: 'Geral' }, 'u1');
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('remove: sem permissão vira 403; admin ignora o userId', async () => {
    RoomService.deleteRoom.mockRejectedValueOnce(new Error('Você não tem permissão para deletar esta sala.'));
    const res = mockRes();
    await RoomController.remove({ params: { id: 'r1' }, userId: 'u2' }, res);
    expect(res.status).toHaveBeenCalledWith(403);

    RoomService.deleteRoom.mockResolvedValueOnce({ message: 'ok' });
    await RoomController.remove({ params: { id: 'r1' }, admin: { role: 'admin' } }, mockRes());
    expect(RoomService.deleteRoom).toHaveBeenLastCalledWith('r1', null, true);
  });
});

describe('statusFromError', () => {
  it.each([
    ['Sala não encontrada.', 404],
    ['Você não tem permissão para deletar esta sala.', 403],
    ['Credenciais inválidas.', 401],
    ['Já existe um usuário com este e-mail.', 409],
    ['O nome da sala é obrigatório.', 400]
  ])('"%s" -> %i', (msg, status) => {
    expect(statusFromError(new Error(msg))).toBe(status);
  });

  it('erro de banco (Sequelize) vira 500', () => {
    const err = new Error('connection lost');
    err.name = 'SequelizeConnectionError';
    expect(statusFromError(err)).toBe(500);
  });
});
