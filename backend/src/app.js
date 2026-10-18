const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { corsOptions } = require('./config/cors');
const { setupSwagger } = require('./config/swagger');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

setupSwagger(app);

const globalApiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 600,
  message: { error: 'Limite de requisições excedido. Tente novamente mais tarde.' },
  skip: () => process.env.NODE_ENV === 'test'
});
app.use('/api', globalApiLimiter);

app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'online', service: 'WebChat MVP API' });
});

module.exports = app;
