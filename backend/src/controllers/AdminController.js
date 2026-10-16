const { safeTimingCompare, generateAdminToken } = require('../utils/security');
const { logSecurityEvent } = require('../utils/auditLogger');

class AdminController {
  auth(req, res) {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Senha é obrigatória' });
    }

    const secret = process.env.ADMIN_SECRET_KEY;
    if (!secret) {
      return res.status(500).json({ error: 'Servidor não configurado para admin' });
    }

    const isMatch = safeTimingCompare(password, secret);
    if (!isMatch) {
      logSecurityEvent({
        eventType: 'ADMIN_ACCESS_FAILED',
        level: 'SECURITY',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        action: 'admin_login',
        status: 'FAILURE'
      });
      return res.status(401).json({ error: 'Senha de administrador incorreta' });
    }

    logSecurityEvent({
      eventType: 'ADMIN_ACCESS_SUCCESS',
      level: 'INFO',
      actor: { id: 'admin-system', role: 'admin' },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      action: 'admin_login',
      status: 'SUCCESS'
    });

    const token = generateAdminToken();
    return res.json({ token, role: 'admin' });
  }
}

module.exports = new AdminController();
