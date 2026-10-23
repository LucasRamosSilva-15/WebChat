function statusFromError(error) {
  const msg = (error && error.message ? error.message : '').toLowerCase();

  if (error && error.name === 'SequelizeUniqueConstraintError') return 409;
  if (error && error.name === 'SequelizeValidationError') return 400;
  if (error && typeof error.name === 'string' && error.name.startsWith('Sequelize')) return 500;

  if (msg.includes('bloqueada')) return 429;
  if (msg.includes('não encontrad')) return 404;
  if (msg.includes('permissão')) return 403;
  if (msg.includes('credenciais') || msg.includes('revogad')) return 401;
  if (msg.includes('já existe')) return 409;
  return 400;
}

function handleError(res, error) {
  const status = statusFromError(error);
  if (status === 500) {
    console.error('[API] Erro interno:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
  return res.status(status).json({ error: error.message });
}

function toPublicUser(user) {
  if (!user) return null;
  const plain = typeof user.toJSON === 'function' ? user.toJSON() : user;
  const { password, ...rest } = plain;
  return { ...rest, name: rest.displayName || (rest.email ? rest.email.split('@')[0] : 'Usuário') };
}

module.exports = { statusFromError, handleError, toPublicUser };
