const jwt = require('jsonwebtoken');

// Login do painel admin: não usa banco, compara com ADMIN_SECRET_KEY do .env.
class AdminController {
  auth(req, res) {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Senha é obrigatória' });
    }

    const secret = process.env.ADMIN_SECRET_KEY;
    if (!secret) {
      return res.status(500).json({ error: 'Servidor não configurado para admin' });
    }

    if (password !== secret) {
      return res.status(401).json({ error: 'Senha de administrador incorreta' });
    }

    const token = jwt.sign(
      { id: 'admin-system', role: 'admin' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '8h' }
    );
    return res.json({ token, role: 'admin' });
  }
}

module.exports = new AdminController();
