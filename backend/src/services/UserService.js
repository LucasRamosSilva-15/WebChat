const UserRepository = require('../repositories/UserRepository');
const {
  hashPassword,
  verifyPassword,
  verifyDummyPassword,
  generateToken,
  validatePasswordPolicy,
  sanitizeEmail,
  isAccountLocked,
  recordFailedLogin,
  resetFailedLogin,
  revokeUserTokens
} = require('../utils/security');
const { logSecurityEvent } = require('../utils/auditLogger');

class UserService {
  async register(userData) {
    const { email, password, displayName } = userData;

    if (!email || !password) {
      throw new Error('E-mail e senha são obrigatórios.');
    }

    const normalizedEmail = sanitizeEmail(email);
    const policy = validatePasswordPolicy(password);
    if (!policy.isValid) {
      throw new Error(policy.message);
    }

    const existingUser = await UserRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error('Já existe um usuário com este e-mail.');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await UserRepository.create({
      email: normalizedEmail,
      password: hashedPassword,
      displayName: (displayName && displayName.trim()) || normalizedEmail.split('@')[0]
    });

    logSecurityEvent({
      eventType: 'AUTH_REGISTER_SUCCESS',
      level: 'INFO',
      actor: { id: newUser.id, email: newUser.email },
      action: 'register',
      status: 'SUCCESS'
    });

    return newUser;
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error('Credenciais inválidas.');
    }

    const normalizedEmail = sanitizeEmail(email);

    const lockStatus = isAccountLocked(normalizedEmail);
    if (lockStatus.isLocked) {
      logSecurityEvent({
        eventType: 'AUTH_ACCOUNT_LOCKED',
        level: 'SECURITY',
        actor: { email: normalizedEmail },
        action: 'login',
        status: 'BLOCKED',
        details: { remainingMinutes: lockStatus.remainingMinutes }
      });
      throw new Error(`Conta temporariamente bloqueada por excesso de tentativas. Tente novamente em ${lockStatus.remainingMinutes} minuto(s).`);
    }

    const user = await UserRepository.findByEmail(normalizedEmail);

    if (!user) {
      await verifyDummyPassword(password);
      recordFailedLogin(normalizedEmail);
      logSecurityEvent({
        eventType: 'AUTH_LOGIN_FAILED',
        level: 'WARN',
        actor: { email: normalizedEmail },
        action: 'login',
        status: 'FAILURE',
        details: { reason: 'User not found' }
      });
      throw new Error('Credenciais inválidas.');
    }

    const { isValid, needsRehash } = await verifyPassword(user.password, password);
    if (!isValid) {
      const failInfo = recordFailedLogin(normalizedEmail);
      logSecurityEvent({
        eventType: 'AUTH_LOGIN_FAILED',
        level: 'WARN',
        actor: { id: user.id, email: user.email },
        action: 'login',
        status: 'FAILURE',
        details: { reason: 'Incorrect password', isLocked: failInfo.isLocked }
      });
      throw new Error('Credenciais inválidas.');
    }

    resetFailedLogin(normalizedEmail);

    if (needsRehash) {
      try {
        const upgradedHash = await hashPassword(password);
        await user.update({ password: upgradedHash });
      } catch (err) {
        console.warn('[SECURITY] Falha ao atualizar hash para Argon2id:', err.message);
      }
    }

    const token = generateToken({
      id: user.id,
      email: user.email
    });

    logSecurityEvent({
      eventType: 'AUTH_LOGIN_SUCCESS',
      level: 'INFO',
      actor: { id: user.id, email: user.email },
      action: 'login',
      status: 'SUCCESS'
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName
      },
      token
    };
  }

  async getAllUsers() {
    return await UserRepository.findAll();
  }

  async getUserById(id) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error('Usuário não encontrado.');
    return user;
  }

  async updateStatus(id, status) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error('Usuário não encontrado.');
    return await user.update({ status });
  }

  async deleteUser(id) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error('Usuário não encontrado.');

    revokeUserTokens(id);
    logSecurityEvent({
      eventType: 'DATA_DELETION',
      level: 'WARN',
      actor: { id: user.id, email: user.email },
      action: 'delete_profile',
      status: 'SUCCESS'
    });

    await UserRepository.delete(id);
    return true;
  }
}

module.exports = new UserService();
