const express = require('express');
const rateLimit = require('express-rate-limit');
const UsuarioController = require('../controllers/UsuarioController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Desligado em testes para não bloquear as requisições automatizadas.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Muitas tentativas. Tente novamente mais tarde.' },
  skip: () => process.env.NODE_ENV === 'test'
});

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Registo, login e dados do usuário autenticado
 *   - name: Rooms
 *     description: Criação e listagem de salas
 *   - name: Messages
 *     description: Mensagens de uma sala
 *   - name: Reports
 *     description: Denúncias de mensagens
 *   - name: Feedbacks
 *     description: Feedbacks dos usuários
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Wssi Helio
 *               email:
 *                 type: string
 *                 example: wssihelio@email.com
 *               password:
 *                 type: string
 *                 example: senhaSegura123
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Campos faltando
 *       409:
 *         description: E-mail já registado
 */
router.post('/register', authLimiter, UsuarioController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário existente (Login)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais incorretas
 */
router.post('/login', authLimiter, UsuarioController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obter dados do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/me', authMiddleware, UsuarioController.me);

/**
 * @swagger
 * /auth/me:
 *   delete:
 *     summary: Excluir perfil do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil excluído com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/me', authMiddleware, UsuarioController.deleteProfile);

module.exports = router;
