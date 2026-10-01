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

module.exports = router;
