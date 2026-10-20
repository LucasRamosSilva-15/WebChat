const express = require('express');
const rateLimit = require('express-rate-limit');
const UsuarioController = require('../controllers/UsuarioController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

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
 *     description: Criação, listagem e moderação de salas
 *   - name: Messages
 *     description: Mensagens de uma sala
 *   - name: Directs
 *     description: Mensagens diretas privadas e conversas
 *   - name: Notifications
 *     description: Notificações do usuário e avisos em tempo real
 *   - name: Favorites
 *     description: Gestão de salas e conversas favoritas
 *   - name: Reports
 *     description: Denúncias de mensagens
 *   - name: Feedbacks
 *     description: Feedbacks dos usuários
 *   - name: Admin
 *     description: Painel e endpoints administrativos
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     description: Cria uma nova conta com senha tratada via hash seguro Argon2id/bcrypt e devolve o token JWT de acesso
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
 *                 example: Lucas Ramos
 *               email:
 *                 type: string
 *                 format: email
 *                 example: lucas@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SenhaForte#2026
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Campos obrigatórios ausentes ou senha fraca
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: E-mail já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', authLimiter, UsuarioController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário existente (Login)
 *     description: Valida credenciais e retorna o perfil público e token JWT
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
 *                 format: email
 *                 example: lucas@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SenhaForte#2026
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: E-mail e senha são obrigatórios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Credenciais incorretas ou conta bloqueada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', authLimiter, UsuarioController.login);

/**
 * @swagger
 * /auth/oauth-sync:
 *   post:
 *     summary: Sincronizar usuário autenticado via OAuth (Google / Supabase)
 *     description: Cria ou atualiza o perfil do usuário na base de dados após login via provedor OAuth e gera token JWT compatível com a API SkyRipple
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario.google@gmail.com
 *               name:
 *                 type: string
 *                 example: Lucas Ramos
 *               avatar_url:
 *                 type: string
 *                 nullable: true
 *                 example: https://lh3.googleusercontent.com/a/photo.jpg
 *     responses:
 *       200:
 *         description: Sincronização bem-sucedida e retorno de token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: E-mail obrigatório ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/oauth-sync', authLimiter, UsuarioController.oauthSync);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autorizado
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
