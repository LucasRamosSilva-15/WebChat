const { isAllowedOrigin } = require('../utils/security');

const allowedOrigins = [
  'https://web-chat-project-web2.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isVercelDomain = /\.vercel\.app$/.test(origin);

    if (isExplicitlyAllowed || isVercelDomain || isAllowedOrigin(origin, process.env.FRONTEND_URL)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};

module.exports = {
  allowedOrigins,
  corsOptions
};
