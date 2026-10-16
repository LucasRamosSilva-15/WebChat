const express = require('express');
const DirectController = require('../controllers/DirectController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /directs/conversations:
 *   get:
 *     summary: Listar todas as conversas diretas do usuário
 *     tags: [Directs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de conversas diretas com status e última mensagem
 */
router.get('/conversations', authMiddleware, DirectController.listConversations);

/**
 * @swagger
 * /directs/conversations:
 *   post:
 *     summary: Obter conversa existente ou criar nova conversa direta com um usuário
 *     tags: [Directs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetUserId]
 *             properties:
 *               targetUserId:
 *                 type: string
 *                 example: a1b2c3d4-e5f6-7890-abcd-ef1234567890
 *     responses:
 *       200:
 *         description: Conversa direta encontrada ou criada com sucesso
 *       400:
 *         description: ID do usuário destino inválido ou igual ao próprio usuário
 */
router.post('/conversations', authMiddleware, DirectController.getOrCreate);

/**
 * @swagger
 * /directs/conversations/{id}/messages:
 *   get:
 *     summary: Obter histórico de mensagens de uma conversa direta
 *     tags: [Directs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da conversa direta
 *     responses:
 *       200:
 *         description: Lista de mensagens diretas da conversa
 *       403:
 *         description: Usuário não tem permissão para acessar esta conversa
 *       404:
 *         description: Conversa não encontrada
 */
router.get('/conversations/:id/messages', authMiddleware, DirectController.listMessages);

/**
 * @swagger
 * /directs/conversations/{id}/messages:
 *   post:
 *     summary: Enviar mensagem de texto ou imagem em conversa direta
 *     tags: [Directs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da conversa direta
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
 *                 example: Olá, tudo bem?
 *               imageUrl:
 *                 type: string
 *                 nullable: true
 *                 example: https://exemplo.com/imagem.png
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso
 *       400:
 *         description: Mensagem vazia ou excede 1000 caracteres
 *       403:
 *         description: Usuário não participa desta conversa
 */
router.post('/conversations/:id/messages', authMiddleware, DirectController.sendMessage);

/**
 * @swagger
 * /directs/conversations/{id}:
 *   delete:
 *     summary: Remover ou ocultar conversa direta para o usuário
 *     tags: [Directs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da conversa direta
 *     responses:
 *       200:
 *         description: Conversa removida com sucesso
 *       403:
 *         description: Sem permissão para remover esta conversa
 *       404:
 *         description: Conversa não encontrada
 */
router.delete('/conversations/:id', authMiddleware, DirectController.removeConversation);

/**
 * @swagger
 * /directs/users:
 *   get:
 *     summary: Buscar usuários disponíveis para iniciar conversa direta
 *     tags: [Directs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Termo de busca por nome ou e-mail
 *     responses:
 *       200:
 *         description: Lista de usuários disponíveis
 */
router.get('/users', authMiddleware, DirectController.listUsers);

module.exports = router;
