const SENSITIVE_KEYS = new Set([
  'password',
  'senha',
  'token',
  'authorization',
  'jwt',
  'secret',
  'admin_secret_key',
  'creditcard',
  'cvv'
]);

const maskSensitiveData = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(maskSensitiveData);

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      clean[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      clean[key] = maskSensitiveData(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
};

const auditLogBuffer = [];
const MAX_BUFFER_SIZE = 1000;

const logSecurityEvent = ({
  eventType,
  level = 'INFO',
  actor = null,
  ip = '0.0.0.0',
  userAgent = null,
  resource = null,
  action = null,
  status = 'SUCCESS',
  details = null
}) => {
  const event = {
    timestamp: new Date().toISOString(),
    level,
    eventType,
    actor: actor ? {
      id: actor.id || 'anonymous',
      email: actor.email || null,
      role: actor.role || 'user'
    } : { id: 'anonymous', role: 'guest' },
    ip: ip || '0.0.0.0',
    userAgent: userAgent || 'unknown',
    resource: resource || 'api',
    action: action || eventType,
    status,
    details: details ? maskSensitiveData(details) : {}
  };

  auditLogBuffer.push(event);
  if (auditLogBuffer.length > MAX_BUFFER_SIZE) {
    auditLogBuffer.shift();
  }

  if (process.env.NODE_ENV !== 'test' || process.env.DEBUG_AUDIT === 'true') {
    const logLine = `[AUDIT_LOG] [${event.level}] ${event.timestamp} - ${event.eventType} | Status: ${event.status} | Actor: ${event.actor.id} (${event.actor.role}) | IP: ${event.ip} | Action: ${event.action}`;
    if (level === 'ERROR' || level === 'SECURITY') {
      console.warn(logLine);
    } else {
      console.log(logLine);
    }
  }

  return event;
};

const getRecentAuditLogs = (limit = 100) => {
  return auditLogBuffer.slice(-limit);
};

const clearAuditLogs = () => {
  auditLogBuffer.length = 0;
};

module.exports = {
  logSecurityEvent,
  getRecentAuditLogs,
  clearAuditLogs,
  maskSensitiveData
};
