const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function parseHistoryParams({ limit = DEFAULT_LIMIT, before = null, since = null } = {}) {
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);

  let validBefore = null;
  if (before) {
    const parsedDate = new Date(before);
    if (!isNaN(parsedDate.getTime())) {
      validBefore = parsedDate.toISOString();
    }
  }

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
