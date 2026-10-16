const { verifyToken } = require('../utils/security');

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Acesso negado: Token não fornecido.' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Acesso negado: Token não fornecido.' });
    }

    const token = parts[1];
    const decoded = verifyToken(token);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso restrito para administradores.' });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

module.exports = adminAuth;
