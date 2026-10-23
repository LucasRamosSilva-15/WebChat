const B64URL_COORD = /^[A-Za-z0-9_-]{43}$/;

function normalizePublicKey(input) {
  let jwk = input;
  if (typeof input === 'string') {
    try {
      jwk = JSON.parse(input);
    } catch {
      throw new Error('Chave pública inválida.');
    }
  }
  if (!jwk || typeof jwk !== 'object' || Array.isArray(jwk)) {
    throw new Error('Chave pública inválida.');
  }
  if ('d' in jwk) {
    throw new Error('Envie apenas a chave pública.');
  }
  if (jwk.kty !== 'EC' || jwk.crv !== 'P-256' || !B64URL_COORD.test(jwk.x || '') || !B64URL_COORD.test(jwk.y || '')) {
    throw new Error('Chave pública inválida: use ECDH P-256.');
  }
  return JSON.stringify({ crv: 'P-256', kty: 'EC', x: jwk.x, y: jwk.y });
}

module.exports = { normalizePublicKey };
