/**
 * Traduz os erros lançados pelos Services (throw new Error('...')) em status HTTP.
 * Os Services usam mensagens em português, então o mapeamento é feito pelo texto.
 * Erros inesperados do Sequelize/banco viram 500.
 */
function statusFromError(error) {
  const msg = (error && error.message ? error.message : '').toLowerCase();

  if (error && error.name === 'SequelizeUniqueConstraintError') return 409;
  if (error && error.name === 'SequelizeValidationError') return 400;
  if (error && typeof error.name === 'string' && error.name.startsWith('Sequelize')) return 500;

  if (msg.includes('não encontrad')) return 404;
  if (msg.includes('permissão')) return 403;
  if (msg.includes('credenciais')) return 401;
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

// Nunca devolvemos o hash da senha para o cliente.
// "name" é mantido por compatibilidade com o frontend (que lê user.name).
function toPublicUser(user) {
  if (!user) return null;
  const plain = typeof user.toJSON === 'function' ? user.toJSON() : user;
  const { password, ...rest } = plain;
  return { ...rest, name: rest.displayName };
}

module.exports = { statusFromError, handleError, toPublicUser };
