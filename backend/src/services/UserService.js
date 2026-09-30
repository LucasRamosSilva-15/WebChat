const UserRepository = require('../repositories/UserRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  async register(userData) {
    const { email, password, displayName } = userData;

    // Validação de regra de negócio
    if (!email || !password) {
      throw new Error('E-mail e senha são obrigatórios.');
    }

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Já existe um usuário com este e-mail.');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserRepository.create({
      email,
      password: hashedPassword,
      displayName: displayName || email.split('@')[0]
    });

    return newUser;
  }

  async login(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciais inválidas.');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas.');
    }

    // Gera o token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'chave_padrao_se_faltar_no_env',
      { expiresIn: '2h' }
    );

    return { user: { id: user.id, email: user.email, displayName: user.displayName }, token };
  }

  async getAllUsers() {
    return await UserRepository.findAll();
  }

  async getUserById(id) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error('Usuário não encontrado.');
    return user;
  }
}

module.exports = new UserService();
