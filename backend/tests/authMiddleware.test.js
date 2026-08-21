const authMiddleware = require('../src/middleware/auth');
const jwt = require('jsonwebtoken');

describe('Auth Middleware Unit Tests', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should return 401 if no authorization header is present', () => {
    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Acesso negado. Token não fornecido.' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token format is invalid', () => {
    mockReq.headers.authorization = 'InvalidFormatToken123';
    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Erro no formato do token.' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid or expired', () => {
    mockReq.headers.authorization = 'Bearer invalid.token.here';
    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado.' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next() and set req.userId if token is valid', () => {
    const validToken = jwt.sign({ id: 'user_123', name: 'Test' }, process.env.JWT_SECRET || 'fallback_secret');
    mockReq.headers.authorization = `Bearer ${validToken}`;
    
    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockReq.userId).toBe('user_123');
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });
});
