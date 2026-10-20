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
 *     summary: Obter histórico paginado de mensagens de uma conversa direta
 *     description: Paginação por cursor. Sem parâmetros, devolve as 50 mensagens mais recentes em ordem cronológica.
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
 *         description: Cursor ISO. Traz apenas mensagens criadas antes desta data
 *       - in: query
 *         name: since
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Sincronização. Traz apenas mensagens criadas depois desta data, em ordem cronológica (tem precedência sobre before). Use o nextSince da resposta para continuar.
 *     responses:
 *       200:
 *         description: Histórico de mensagens diretas com metadados de cursor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       messageId:
 *                         type: string
 *                         format: uuid
 *                       sender:
 *                         type: string
 *                       text:
 *                         type: string
 *                       image:
 *                         type: string
 *                         nullable: true
 *                       time:
 *                         type: string
 *                         description: Hora formatada (HH:mm)
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       isMe:
 *                         type: boolean
 *                 hasMore:
 *                   type: boolean
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
 *             description: Informe content, imageUrl ou attachment. Em conversas com E2EE o content é o envelope cifrado 'e2ee:v1:...'
 *             properties:
 *               content:
 *                 type: string
 *                 example: Olá, tudo bem?
 *               imageUrl:
 *                 type: string
 *                 nullable: true
 *                 example: https://exemplo.com/imagem.png
 *               attachment:
 *                 type: object
 *                 nullable: true
 *                 description: Anexo (áudio gravado ou documento, até 5 MB) como data URL base64
 *                 properties:
 *                   url:
 *                     type: string
 *                     example: data:audio/webm;base64,GkXfo59ChoEBQveBAULygQRC...
 *                   type:
 *                     type: string
 *                     example: audio/webm
 *                   name:
 *                     type: string
 *                     example: audio-2026-10-19.webm
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

/**
 * @swagger
 * /directs/keys:
 *   put:
 *     summary: Registrar a chave pública E2EE do usuário (ECDH P-256, JWK)
 *     description: O servidor guarda apenas a chave pública. A chave privada nunca sai do navegador.
 *     tags: [Directs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [publicKey]
 *             properties:
 *               publicKey:
 *                 type: object
 *                 required: [kty, crv, x, y]
 *                 properties:
 *                   kty:
 *                     type: string
 *                     example: EC
 *                   crv:
 *                     type: string
 *                     example: P-256
 *                   x:
 *                     type: string
 *                   y:
 *                     type: string
 *     responses:
 *       200:
 *         description: Chave registrada
 *       400:
 *         description: Chave inválida (ou contém material privado)
 *       401:
 *         description: Não autorizado
 */
router.put('/keys', authMiddleware, DirectController.setPublicKey);

/**
 * @swagger
 * /directs/keys/{userId}:
 *   get:
 *     summary: Obter a chave pública E2EE de um usuário
 *     tags: [Directs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "{ userId, publicKey } — publicKey é null se o usuário ainda não ativou a criptografia"
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/keys/:userId', authMiddleware, DirectController.getPublicKey);

module.exports = router;
