const { verifyToken } = require('../utils/security');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Erro no formato do token.' });
  }

  const token = parts[1];

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};