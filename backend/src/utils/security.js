const crypto = require('crypto');
const argon2 = require('argon2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_DEFAULT_EXPIRY = '7d';
const ADMIN_TOKEN_EXPIRY = '8h';
const JWT_ISSUER = 'webchat:skyripple';
const JWT_AUDIENCE = 'webchat:client';
const JWT_ALGORITHM = 'HS256';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[CRITICAL_SECURITY] JWT_SECRET não configurado no ambiente de produção.');
    }
    return 'fallback_secret';
  }
  return secret;
};

const DUMMY_ARGON2_HASH = '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQxMjM0NTY3OA$9NN7P6MNgziJaIP/Hu2wSWLHaR67YsCkQXubuitkbE8';

const revokedUsers = new Map();
const revokedTokens = new Set();

const revokeUserTokens = (userId) => {
  if (!userId) return;
  revokedUsers.set(String(userId), Date.now());
};

const revokeSingleToken = (jti) => {
  if (jti) {
    revokedTokens.add(String(jti));
  }
};

const isTokenRevoked = (decodedToken) => {
  if (!decodedToken) return true;
  const userId = String(decodedToken.id || decodedToken.sub);
  const userRevokedAt = revokedUsers.get(userId);
  if (userRevokedAt) {
    const tokenIssuedAt = decodedToken.iat ? decodedToken.iat * 1000 : 0;
    if (tokenIssuedAt <= userRevokedAt) {
      return true;
    }
  }
  if (decodedToken.jti && revokedTokens.has(String(decodedToken.jti))) {
    return true;
  }
  return false;
};

const clearRevocations = () => {
  revokedUsers.clear();
  revokedTokens.clear();
};

const failedLoginAttempts = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;

const isAccountLocked = (email) => {
  const key = sanitizeEmail(email);
  if (!key) return { isLocked: false, remainingMinutes: 0 };
  const record = failedLoginAttempts.get(key);
  if (!record) return { isLocked: false, remainingMinutes: 0 };

  const now = Date.now();
  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
    return { isLocked: true, remainingMinutes };
  }

  if (record.lockedUntil && record.lockedUntil <= now) {
    failedLoginAttempts.delete(key);
    return { isLocked: false, remainingMinutes: 0 };
  }

  return { isLocked: false, remainingMinutes: 0 };
};

const recordFailedLogin = (email) => {
  const key = sanitizeEmail(email);
  if (!key) return { isLocked: false, remainingMinutes: 0 };

  const now = Date.now();
  const record = failedLoginAttempts.get(key) || { count: 0, lockedUntil: null, lastAttempt: now };

  if (now - record.lastAttempt > LOCKOUT_WINDOW_MS) {
    record.count = 0;
  }

  record.count += 1;
  record.lastAttempt = now;

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_WINDOW_MS;
    failedLoginAttempts.set(key, record);
    const remainingMinutes = Math.ceil(LOCKOUT_WINDOW_MS / 60000);
    return { isLocked: true, remainingMinutes };
  }

  failedLoginAttempts.set(key, record);
  return { isLocked: false, remainingMinutes: 0 };
};

const resetFailedLogin = (email) => {
  const key = sanitizeEmail(email);
  if (key) {
    failedLoginAttempts.delete(key);
  }
};

const clearAccountLockouts = () => {
  failedLoginAttempts.clear();
};

const hashPassword = async (plainPassword) => {
  return await argon2.hash(plainPassword, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4
  });
};

const verifyPassword = async (storedHash, plainPassword) => {
  if (!storedHash || typeof storedHash !== 'string' || !plainPassword) {
    await verifyDummyPassword(plainPassword);
    return { isValid: false, needsRehash: false };
  }

  if (storedHash.startsWith('$argon2')) {
    try {
      const isValid = await argon2.verify(storedHash, plainPassword);
      return { isValid, needsRehash: false };
    } catch {
      return { isValid: false, needsRehash: false };
    }
  }

  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
    try {
      const isValid = await bcrypt.compare(plainPassword, storedHash);
      return { isValid, needsRehash: isValid };
    } catch {
      return { isValid: false, needsRehash: false };
    }
  }

  return { isValid: false, needsRehash: false };
};

const verifyDummyPassword = async (plainPassword) => {
  try {
    await argon2.verify(DUMMY_ARGON2_HASH, plainPassword || 'dummy_password');
  } catch {
  }
};

const safeTimingCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
};

const generateToken = (payload, options = {}) => {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, {
    algorithm: JWT_ALGORITHM,
    expiresIn: options.expiresIn || JWT_DEFAULT_EXPIRY,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    ...options
  });
};

const verifyToken = (token, options = {}) => {
  const secret = getJwtSecret();
  const decoded = jwt.verify(token, secret, {
    algorithms: [JWT_ALGORITHM],
    ...options
  });

  if (isTokenRevoked(decoded)) {
    throw new Error('Token revogado ou sessão encerrada.');
  }

  return decoded;
};

const generateAdminToken = (payload = {}, options = {}) => {
  return generateToken(
    { id: 'admin-system', role: 'admin', ...payload },
    { expiresIn: ADMIN_TOKEN_EXPIRY, ...options }
  );
};

const validatePasswordPolicy = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Senha é obrigatória.' };
  }
  if (password.length < 6) {
    return { isValid: false, message: 'A senha deve conter no mínimo 6 caracteres.' };
  }
  if (password.length > 128) {
    return { isValid: false, message: 'A senha não pode exceder 128 caracteres.' };
  }
  return { isValid: true };
};

const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
};

const sanitizeText = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/javascript:[^"']*/gi, '')
    .replace(/on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')
    .trim();
};

const isAllowedOrigin = (origin, frontendUrl) => {
  if (!origin) return true;
  const allowed = [
    'http://localhost:5173',
    'https://web-chat-project-web2.vercel.app',
    frontendUrl,
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL
  ].filter(Boolean);

  if (allowed.includes(origin)) return true;
  if (/^https:\/\/web-chat-project-web2.*\.vercel\.app$/.test(origin)) return true;

  const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:[0-9]{1,5})?$/;
  return localhostRegex.test(origin);
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyDummyPassword,
  safeTimingCompare,
  generateToken,
  verifyToken,
  generateAdminToken,
  validatePasswordPolicy,
  sanitizeEmail,
  sanitizeText,
  isAllowedOrigin,
  revokeUserTokens,
  revokeSingleToken,
  isTokenRevoked,
  clearRevocations,
  isAccountLocked,
  recordFailedLogin,
  resetFailedLogin,
  clearAccountLockouts,
  getJwtSecret
};
