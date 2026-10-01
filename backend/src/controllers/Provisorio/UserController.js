const UserService = require('../services/UserService');

class UserController {
  async register(req, res) {
    try {
      const user = await UserService.register(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const data = await UserService.login(email, password);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const users = await UserService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
  }

  async getById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
