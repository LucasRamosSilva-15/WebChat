const UserService = require('../services/UserService');
const { handleError, toPublicUser } = require('./errorHandler');

class UsuarioController {
  async register(req, res) {
    try {
      const { name, displayName, email, password } = req.body;
      const user = await UserService.register({
        email,
        password,
        displayName: displayName || name
      });

      // Já devolve o token, como o frontend espera após o cadastro.
      const { token } = await UserService.login(email, password);
      return res.status(201).json({ user: toPublicUser(user), token });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
      }
      const { user, token } = await UserService.login(email, password);
      return res.status(200).json({ user: toPublicUser(user), token });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async me(req, res) {
    try {
      const user = await UserService.getUserById(req.userId);
      return res.status(200).json(toPublicUser(user));
    } catch (error) {
      return handleError(res, error);
    }
  }

  async deleteProfile(req, res) {
    try {
      await UserService.deleteUser(req.userId);
      return res.status(200).json({ message: 'Perfil excluído com sucesso.' });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async list(req, res) {
    try {
      const users = await UserService.getAllUsers();
      return res.status(200).json(users.map(toPublicUser));
    } catch (error) {
      return handleError(res, error);
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = await UserService.updateStatus(id, status);
      return res.status(200).json(user);
    } catch (error) {
      return handleError(res, error);
    }
  }
}

module.exports = new UsuarioController();
