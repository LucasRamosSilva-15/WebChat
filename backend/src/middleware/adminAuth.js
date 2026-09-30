const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Acesso negado: Token não fornecido.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Acesso restrito para administradores.' });
        }

        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
};

module.exports = adminAuth;
