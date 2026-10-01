const express = require('express');
const rateLimit = require('express-rate-limit');

const AdminController = require('../controllers/AdminController');
const usuarioRoutes = require('./usuarioRoutes');
const roomRoutes = require('./roomRoutes');
const messageRoutes = require('./messageRoutes');
const reportRoutes = require('./reportRoutes');
const feedbackRoutes = require('./feedbackRoutes');
const StatsController = require('../controllers/StatsController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Muitas tentativas de admin. Bloqueado por 15 minutos.' },
  skip: () => process.env.NODE_ENV === 'test'
});

/**
 * @swagger
 * /admin/auth:
 *   post:
 *     summary: Login de administrador
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token de admin retornado
 */
router.post('/admin/auth', adminLimiter, AdminController.auth);

router.use('/auth', usuarioRoutes);
router.use('/rooms', roomRoutes);
router.use('/reports', reportRoutes);
router.use('/feedbacks', feedbackRoutes);
router.use('/', messageRoutes);

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Estatísticas globais do painel admin
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas do sistema
 */
router.get('/stats', authMiddleware, StatsController.getGlobalStats);

module.exports = router;