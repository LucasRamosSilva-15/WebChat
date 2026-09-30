const express = require('express');
const rateLimit = require('express-rate-limit');

const AdminController = require('../controllers/AdminController');
const usuarioRoutes = require('./usuarioRoutes');
const roomRoutes = require('./roomRoutes');
const messageRoutes = require('./messageRoutes');
const reportRoutes = require('./reportRoutes');
const feedbackRoutes = require('./feedbackRoutes');

// Este arquivo só agrega as rotas; nenhuma regra de negócio ou acesso a banco fica aqui.
const router = express.Router();

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Muitas tentativas de admin. Bloqueado por 15 minutos.' },
  skip: () => process.env.NODE_ENV === 'test'
});

router.post('/admin/auth', adminLimiter, AdminController.auth);

router.use('/auth', usuarioRoutes);
router.use('/rooms', roomRoutes);
router.use('/reports', reportRoutes);
router.use('/feedbacks', feedbackRoutes);
router.use('/', messageRoutes);

module.exports = router;
