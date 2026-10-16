const express = require('express');
const FavoriteController = require('../controllers/FavoriteController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Listar todos os itens favoritados pelo usuário (salas e conversas)
 *     tags: [Favorites]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de favoritos do usuário
 */
router.get('/', authMiddleware, FavoriteController.list);

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Adicionar uma sala ou conversa direta aos favoritos
 *     tags: [Favorites]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [item_type, item_id]
 *             properties:
 *               item_type:
 *                 type: string
 *                 enum: [room, conversation]
 *                 example: room
 *               item_id:
 *                 type: string
 *                 example: sala-geral
 *               title:
 *                 type: string
 *                 example: Sala Geral
 *               content:
 *                 type: string
 *                 example: Sala de bate-papo geral
 *               meta:
 *                 type: object
 *                 description: Informações adicionais do item favoritado
 *     responses:
 *       201:
 *         description: Item favoritado com sucesso
 *       400:
 *         description: Parâmetros obrigatórios faltando ou inválidos
 */
router.post('/', authMiddleware, FavoriteController.create);

/**
 * @swagger
 * /favorites/{itemType}/{itemId}:
 *   delete:
 *     summary: Remover um item dos favoritos
 *     tags: [Favorites]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [room, conversation]
 *         description: Tipo do item favoritado
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do item favoritado
 *     responses:
 *       200:
 *         description: Favorito removido com sucesso
 *       404:
 *         description: Favorito não encontrado
 */
router.delete('/:itemType/:itemId', authMiddleware, FavoriteController.remove);

module.exports = router;
