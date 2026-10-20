const express = require('express');
const MessageController = require('../controllers/MessageController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /rooms/{roomId}/messages:
 *   get:
 *     summary: Listar histórico paginado de mensagens da sala
 *     description: Paginação por cursor. Sem parâmetros, devolve as 50 mensagens mais recentes em ordem cronológica.
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           minimum: 1
 *           maximum: 100
 *         description: Número máximo de mensagens a retornar (1 a 100)
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Cursor ISO. Traz apenas mensagens criadas antes desta data (use o nextCursor da resposta anterior)
 *       - in: query
 *         name: since
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Sincronização. Traz apenas mensagens criadas depois desta data, em ordem cronológica (tem precedência sobre before). Use o nextSince da resposta para continuar.
 *     responses:
 *       200:
 *         description: Histórico de mensagens com metadados de cursor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *                 hasMore:
 *                   type: boolean
 *                   description: true se ainda existem mensagens mais antigas
 *                 nextCursor:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 nextSince:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   description: Só no modo since; cursor para a próxima página de mensagens mais novas
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/rooms/:roomId/messages', authMiddleware, MessageController.listByRoom);

/**
 * @swagger
 * /rooms/{roomId}/messages/search:
 *   get:
 *     summary: Buscar mensagens na sala
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de mensagens filtradas
 */
router.get('/rooms/:roomId/messages/search', authMiddleware, MessageController.search);

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
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Mensagem criada
 *       400:
 *         description: Conteúdo vazio ou excede 1.000 caracteres
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
