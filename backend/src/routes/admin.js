const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const UsuarioController = require('../controllers/UsuarioController');
const RoomController = require('../controllers/RoomController');
const MessageController = require('../controllers/MessageController');
const ReportController = require('../controllers/ReportController');
const FeedbackController = require('../controllers/FeedbackController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Rotas protegidas de administração
 */

router.use(adminAuth);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sucesso
 */
router.get('/users', UsuarioController.list);

/**
 * @swagger
 * /admin/users/{id}/status:
 *   put:
 *     summary: Alterar status de usuário
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status atualizado
 */
router.put('/users/:id/status', UsuarioController.updateStatus);

/**
 * @swagger
 * /admin/rooms:
 *   get:
 *     summary: Listar todas as salas (Admin)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de salas
 */
router.get('/rooms', RoomController.list);

/**
 * @swagger
 * /admin/rooms/{id}:
 *   delete:
 *     summary: Apagar sala (Admin)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sala apagada
 */
router.delete('/rooms/:id', RoomController.remove);

/**
 * @swagger
 * /admin/messages/{id}:
 *   delete:
 *     summary: Apagar mensagem (Admin)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mensagem apagada
 */
router.delete('/messages/:id', MessageController.remove);

/**
 * @swagger
 * /admin/reports:
 *   get:
 *     summary: Listar denúncias (Admin)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sucesso
 */
router.get('/reports', ReportController.list);

/**
 * @swagger
 * /admin/reports/{id}:
 *   put:
 *     summary: Alterar status da denúncia (Admin)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status alterado
 */
router.put('/reports/:id', ReportController.updateStatus);

/**
 * @swagger
 * /admin/reports/{id}:
 *   delete:
 *     summary: Apagar denúncia (Admin)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Apagada
 */
router.delete('/reports/:id', ReportController.remove);

/**
 * @swagger
 * /admin/feedbacks:
 *   get:
 *     summary: Listar feedbacks (Admin)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sucesso
 */
router.get('/feedbacks', FeedbackController.list);

/**
 * @swagger
 * /admin/feedbacks/{id}:
 *   put:
 *     summary: Alterar status do feedback (Admin)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sucesso
 */
router.put('/feedbacks/:id', FeedbackController.updateStatus);

/**
 * @swagger
 * /admin/feedbacks/{id}:
 *   delete:
 *     summary: Apagar feedback (Admin)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Apagado
 */
router.delete('/feedbacks/:id', FeedbackController.remove);

module.exports = router;
