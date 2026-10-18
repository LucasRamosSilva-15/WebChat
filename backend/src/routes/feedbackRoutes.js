const express = require('express');
const FeedbackController = require('../controllers/FeedbackController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /feedbacks:
 *   post:
 *     summary: Enviar feedback ou relato de melhoria
 *     description: Registra uma sugestão ou reporte de bug acompanhado opcionalmente de imagens em anexo
 *     tags: [Feedbacks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [comment]
 *             properties:
 *               comment:
 *                 type: string
 *                 example: Excelente usabilidade nas salas temáticas, sugiro adicionar suporte a áudios.
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Feedback registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Comentário obrigatório ou formato inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Não autorizado (token ausente ou inválido)
 */
router.post('/', authMiddleware, FeedbackController.create);

module.exports = router;
