const express = require('express');
const MessageController = require('../controllers/MessageController');
const authMiddleware = require('../middleware/auth');

// Montado na raiz de /api porque mistura /rooms/:roomId/messages e /messages/:id.
const router = express.Router();

/**
 * @swagger
 * /rooms/{roomId}/messages:
 *   get:
 *     summary: Listar histórico de mensagens de uma sala
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de mensagens
 */
router.get('/rooms/:roomId/messages', authMiddleware, MessageController.listByRoom);

/**
 * @swagger
 * /rooms/{roomId}/messages:
 *   post:
 *     summary: Enviar mensagem para uma sala
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mensagem criada
 *       400:
 *         description: Conteúdo vazio
 */
router.post('/rooms/:roomId/messages', authMiddleware, MessageController.send);

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: Apagar mensagem (autor ou admin)
 *     tags: [Messages]
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
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Mensagem não encontrada
 */
router.delete('/messages/:id', authMiddleware, MessageController.remove);

module.exports = router;
