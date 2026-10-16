const express = require('express');
const RoomController = require('../controllers/RoomController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Listar todas as salas
 *     tags: [Rooms]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de salas
 */
router.get('/', authMiddleware, RoomController.list);

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Criar nova sala
 *     tags: [Rooms]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sala Geral
 *               type:
 *                 type: string
 *                 example: public
 *     responses:
 *       201:
 *         description: Sala criada
 *       400:
 *         description: Nome da sala não informado
 */
router.post('/', authMiddleware, RoomController.create);

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Buscar uma sala pelo ID
 *     tags: [Rooms]
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
 *         description: Sala encontrada
 *       404:
 *         description: Sala não encontrada
 */
router.get('/:id', authMiddleware, RoomController.getById);

/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Apagar uma sala (criador ou admin)
 *     tags: [Rooms]
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
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Sala não encontrada
 */
router.delete('/:id', authMiddleware, RoomController.remove);

/**
 * @swagger
 * /rooms/{id}/join:
 *   post:
 *     summary: Entrar em uma sala
 *     tags: [Rooms]
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
 *         description: Entrou na sala
 *       400:
 *         description: Erro ao entrar
 */
router.post('/:id/join', authMiddleware, RoomController.join);

/**
 * @swagger
 * /rooms/{id}/members:
 *   get:
 *     summary: Listar membros da sala
 *     tags: [Rooms]
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
 *         description: Lista de membros
 */
router.get('/:id/members', authMiddleware, RoomController.getMembers);

/**
 * @swagger
 * /rooms/{id}:
 *   put:
 *     summary: Atualizar dados de uma sala (proprietário ou admin)
 *     tags: [Rooms]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sala Geral Renovada
 *               description:
 *                 type: string
 *                 example: Nova descrição da sala
 *               category:
 *                 type: string
 *                 example: tecnologia
 *               image_url:
 *                 type: string
 *                 example: https://exemplo.com/icone.png
 *     responses:
 *       200:
 *         description: Sala atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Sem permissão para editar esta sala
 *       404:
 *         description: Sala não encontrada
 */
router.put('/:id', authMiddleware, RoomController.update);

/**
 * @swagger
 * /rooms/{roomId}/members/{userId}/role:
 *   patch:
 *     summary: Alterar cargo de membro na sala (moderador ou membro comum)
 *     tags: [Rooms]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [moderator, user]
 *                 example: moderator
 *     responses:
 *       200:
 *         description: Cargo atualizado com sucesso
 *       400:
 *         description: Cargo inválido
 *       403:
 *         description: Apenas o dono ou admin pode alterar cargos
 *       404:
 *         description: Membro ou sala não encontrado
 */
router.patch('/:roomId/members/:userId/role', authMiddleware, RoomController.updateMemberRole);

/**
 * @swagger
 * /rooms/{roomId}/members/{userId}:
 *   delete:
 *     summary: Expulsar membro de uma sala (proprietário ou moderador)
 *     tags: [Rooms]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Violação das regras de conduta
 *     responses:
 *       200:
 *         description: Membro expulso com sucesso
 *       403:
 *         description: Sem permissão para expulsar este membro
 *       404:
 *         description: Membro ou sala não encontrado
 */
router.delete('/:roomId/members/:userId', authMiddleware, RoomController.kickMember);

/**
 * @swagger
 * /rooms/{id}/transfer-ownership:
 *   post:
 *     summary: Transferir posse da sala para outro membro
 *     tags: [Rooms]
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
 *             required: [newOwnerId]
 *             properties:
 *               newOwnerId:
 *                 type: string
 *                 example: user-uuid-123
 *     responses:
 *       200:
 *         description: Posse transferida com sucesso
 *       400:
 *         description: ID do novo dono inválido ou igual ao atual
 *       403:
 *         description: Apenas o dono atual pode transferir a posse
 *       404:
 *         description: Sala ou novo dono não encontrado
 */
router.post('/:id/transfer-ownership', authMiddleware, RoomController.transferOwnership);

module.exports = router;
