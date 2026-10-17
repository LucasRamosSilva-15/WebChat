const bcrypt = require('bcryptjs');
const {
  hashPassword,
  verifyPassword,
  safeTimingCompare,
  generateToken,
  verifyToken,
  generateAdminToken,
  validatePasswordPolicy,
  sanitizeEmail,
  sanitizeText,
  isAllowedOrigin,
  revokeUserTokens,
  clearRevocations,
  isAccountLocked,
  recordFailedLogin,
  resetFailedLogin,
  clearAccountLockouts
} = require('../src/utils/security');
const { logSecurityEvent, maskSensitiveData } = require('../src/utils/auditLogger');

describe('Security Utility (CIS IG1 Baseline)', () => {
  beforeEach(() => {
    clearRevocations();
    clearAccountLockouts();
  });

  describe('Password Hashing with Argon2id and Bcrypt fallback', () => {
    it('gera hash Argon2id válido para senhas', async () => {
      const password = 'SuperSenhaSegura2026!';
      const hash = await hashPassword(password);

      expect(hash).toMatch(/^\$argon2id\$/);

      const result = await verifyPassword(hash, password);
      expect(result.isValid).toBe(true);
      expect(result.needsRehash).toBe(false);
    });

    it('rejeita senha incorreta com hash Argon2id', async () => {
      const hash = await hashPassword('correta123');
      const result = await verifyPassword(hash, 'errada123');

      expect(result.isValid).toBe(false);
    });

    it('valida hash bcrypt legado e sinaliza needsRehash para migração transparente', async () => {
      const legacyPassword = 'senhaLegadaBcrypt123';
      const bcryptHash = await bcrypt.hash(legacyPassword, 10);

      expect(bcryptHash).toMatch(/^\$2[aby]\$/);

      const result = await verifyPassword(bcryptHash, legacyPassword);
      expect(result.isValid).toBe(true);
      expect(result.needsRehash).toBe(true);
    });

    it('rejeita hash corrompido ou string vazia sem lançar exceção não tratada', async () => {
      const result = await verifyPassword('hash_invalido_qualquer', 'senha123');
      expect(result.isValid).toBe(false);
      expect(result.needsRehash).toBe(false);
    });
  });

  describe('Constant-Time Comparison (safeTimingCompare)', () => {
    it('compara strings idênticas com sucesso', () => {
      expect(safeTimingCompare('MinhaChaveAdmin123', 'MinhaChaveAdmin123')).toBe(true);
    });

    it('rejeita strings diferentes sem vazar timing', () => {
      expect(safeTimingCompare('MinhaChaveAdmin123', 'OutraChaveInvalida')).toBe(false);
      expect(safeTimingCompare('MinhaChaveAdmin123', 'MinhaChaveAdmin124')).toBe(false);
    });

    it('retorna false seguro para entradas nulas ou não-string', () => {
      expect(safeTimingCompare(null, 'chave')).toBe(false);
      expect(safeTimingCompare(undefined, undefined)).toBe(false);
      expect(safeTimingCompare(123, '123')).toBe(false);
    });
  });

  describe('Hardened JWT Lifecycle & Token Revocation (CIS 6.1)', () => {
    it('emite e valida tokens com algoritmo HS256 restrito', () => {
      const payload = { id: 'usr_abc123', email: 'test@skyripple.com' };
      const token = generateToken(payload);

      expect(typeof token).toBe('string');

      const decoded = verifyToken(token);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
    });

    it('emite token de administrador com role=admin', () => {
      const adminTok = generateAdminToken();
      const decoded = verifyToken(adminTok);

      expect(decoded.role).toBe('admin');
      expect(decoded.id).toBe('admin-system');
    });

    it('rejeita token corrompido', () => {
      expect(() => verifyToken('token.invalido.falso')).toThrow();
    });

    it('revoga tokens emitidos antes da data de revogação do usuário', async () => {
      const userId = 'usr_revocation_target';
      const token = generateToken({ id: userId, email: 'revoked@test.com' });

      expect(verifyToken(token).id).toBe(userId);

      // Simula passagem de tempo e revogação
      await new Promise(r => setTimeout(r, 10));
      revokeUserTokens(userId);

      expect(() => verifyToken(token)).toThrow(/revogado/i);
    });
  });

  describe('Account Lockout & Brute-Force Defense (CIS 5.3)', () => {
    it('bloqueia conta após 5 tentativas consecutivas de login com falha', () => {
      const targetEmail = 'alvo_forca_bruta@teste.com';

      for (let i = 1; i <= 4; i++) {
        const fail = recordFailedLogin(targetEmail);
        expect(fail.isLocked).toBe(false);
        expect(isAccountLocked(targetEmail).isLocked).toBe(false);
      }

      const finalFail = recordFailedLogin(targetEmail);
      expect(finalFail.isLocked).toBe(true);
      expect(finalFail.remainingMinutes).toBeGreaterThan(0);

      const status = isAccountLocked(targetEmail);
      expect(status.isLocked).toBe(true);
      expect(status.remainingMinutes).toBeGreaterThan(0);
    });

    it('limpa bloqueio e contador após login bem-sucedido', () => {
      const targetEmail = 'sucesso_login@teste.com';
      recordFailedLogin(targetEmail);
      recordFailedLogin(targetEmail);

      resetFailedLogin(targetEmail);
      expect(isAccountLocked(targetEmail).isLocked).toBe(false);
    });
  });

  describe('Input Sanitization & XSS Defense (CIS 10.3 & 16.11)', () => {
    it('remove tags script, iframes e atributos inline perigosos de mensagens', () => {
      const malicious = '<script>alert("XSS")</script>Olá mundo! <img src="x" onerror="evil()" /> e <iframe src="evil.com"></iframe>';
      const sanitized = sanitizeText(malicious);

      expect(sanitized).not.toContain('<script');
      expect(sanitized).not.toContain('onerror');
      expect(sanitized).not.toContain('<iframe');
      expect(sanitized).toContain('Olá mundo!');
    });

    it('preserva emojis, pontuações e texto regular intactos', () => {
      const regular = 'Boa tarde pessoal! Tudo certo por aqui? 🚀✨';
      expect(sanitizeText(regular)).toBe(regular);
    });
  });

  describe('Strict CORS Origin Whitelisting (CIS 4.1)', () => {
    it('permite localhost seguro e 127.0.0.1 com portas arbitrárias', () => {
      expect(isAllowedOrigin('http://localhost:5173')).toBe(true);
      expect(isAllowedOrigin('http://localhost:3000')).toBe(true);
      expect(isAllowedOrigin('http://127.0.0.1:3001')).toBe(true);
      expect(isAllowedOrigin(null)).toBe(true);
    });

    it('bloqueia tentativas de bypass de CORS contendo localhost no nome de domínio', () => {
      expect(isAllowedOrigin('https://attacker-localhost.com')).toBe(false);
      expect(isAllowedOrigin('https://localhost.attacker.io')).toBe(false);
      expect(isAllowedOrigin('http://evil.com')).toBe(false);
    });

    it('permite a URL de frontend de produção configurada', () => {
      const prodUrl = 'https://skyripple.vercel.app';
      expect(isAllowedOrigin(prodUrl, prodUrl)).toBe(true);
    });

    it('permite a URL oficial de produção na Vercel e previews dinâmicos', () => {
      expect(isAllowedOrigin('https://web-chat-project-web2.vercel.app')).toBe(true);
      expect(isAllowedOrigin('https://web-chat-project-web2-git-main-user.vercel.app')).toBe(true);
      expect(isAllowedOrigin('https://web-chat-project-web2-abc123.vercel.app')).toBe(true);
    });

    it('permite CLIENT_URL configurado nas variáveis de ambiente', () => {
      process.env.CLIENT_URL = 'https://meu-client-customizado.com';
      expect(isAllowedOrigin('https://meu-client-customizado.com')).toBe(true);
      delete process.env.CLIENT_URL;
    });
  });

  describe('Security Audit Logging & Data Masking (CIS 8.2 & 8.5)', () => {
    it('registra evento estruturado de auditoria com metadados higienizados', () => {
      const event = logSecurityEvent({
        eventType: 'TEST_SECURITY_EVENT',
        level: 'SECURITY',
        actor: { id: 'usr_audit_test', email: 'audit@test.com', role: 'admin' },
        ip: '192.168.1.100',
        action: 'test_action',
        status: 'SUCCESS',
        details: {
          user_id: 'usr_audit_test',
          password: 'super_secret_password',
          token: 'jwt.token.here',
          safeParam: 'public_value'
        }
      });

      expect(event.eventType).toBe('TEST_SECURITY_EVENT');
      expect(event.actor.id).toBe('usr_audit_test');
      expect(event.details.safeParam).toBe('public_value');
      expect(event.details.password).toBe('[REDACTED]');
      expect(event.details.token).toBe('[REDACTED]');
    });

    it('redige recursivamente chaves sensíveis em objetos aninhados', () => {
      const payload = {
        auth: {
          token: 'token123',
          secret: 'secret456'
        },
        profile: {
          name: 'Lucas'
        }
      };

      const masked = maskSensitiveData(payload);
      expect(masked.auth.token).toBe('[REDACTED]');
      expect(masked.auth.secret).toBe('[REDACTED]');
      expect(masked.profile.name).toBe('Lucas');
    });
  });
});
