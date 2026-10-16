const express = require('express');
const NotificationController = require('../controllers/NotificationController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Listar todas as notificações do usuário autenticado
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificações ordenadas por data de criação
 */
router.get('/', authMiddleware, NotificationController.list);

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Criar uma nova notificação para o usuário
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               type:
 *                 type: string
 *                 example: message
 *               title:
 *                 type: string
 *                 example: Nova Mensagem
 *               content:
 *                 type: string
 *                 example: Você recebeu uma nova mensagem direta.
 *               link:
 *                 type: string
 *                 example: /directs
 *               data:
 *                 type: object
 *                 description: Metadados adicionais da notificação
 *     responses:
 *       201:
 *         description: Notificação criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authMiddleware, NotificationController.create);

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: Marcar todas as notificações do usuário autenticado como lidas
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Todas as notificações foram marcadas como lidas
 */
router.patch('/read-all', authMiddleware, NotificationController.markAllAsRead);

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Marcar notificação específica como lida
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da notificação
 *     responses:
 *       200:
 *         description: Notificação marcada como lida
 *       404:
 *         description: Notificação não encontrada
 */
router.patch('/:id/read', authMiddleware, NotificationController.markAsRead);

/**
 * @swagger
 * /notifications/all:
 *   delete:
 *     summary: Excluir todas as notificações do usuário autenticado
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Todas as notificações foram removidas com sucesso
 */
router.delete('/all', authMiddleware, NotificationController.clearAll);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Excluir uma notificação específica
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da notificação
 *     responses:
 *       200:
 *         description: Notificação removida com sucesso
 *       404:
 *         description: Notificação não encontrada
 */
router.delete('/:id', authMiddleware, NotificationController.remove);

module.exports = router;
