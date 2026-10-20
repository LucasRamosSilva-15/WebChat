/**
 * Utilitários de paginação por cursor (histórico de mensagens).
 * Usado pelos Services para sanitizar os parâmetros vindos da query string.
 */
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

/**
 * Normaliza `limit` e `before`.
 * - limit: inteiro entre 1 e 100 (inválido ou ausente => 50). Impede pedir milhões de linhas.
 * - since: data ISO válida; troca a direção da busca (mais novas que a data, em ordem cronológica).
 * - before: data ISO válida; se for inválida, é ignorada (retorna null) em vez de estourar no banco.
 */
function parseHistoryParams({ limit = DEFAULT_LIMIT, before = null, since = null } = {}) {
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);

  let validBefore = null;
  if (before) {
    const parsedDate = new Date(before);
    if (!isNaN(parsedDate.getTime())) {
      validBefore = parsedDate.toISOString();
    }
  }

  // since: só mensagens criadas DEPOIS desta data (sincronização após reconexão).
  // Quando informado, tem precedência sobre `before`.
  let validSince = null;
  if (since) {
    const parsedSince = new Date(since);
    if (!isNaN(parsedSince.getTime())) {
      validSince = parsedSince.toISOString();
    }
  }

  return { limit: parsedLimit, before: validSince ? null : validBefore, since: validSince };
}

module.exports = { parseHistoryParams, DEFAULT_LIMIT, MAX_LIMIT };
