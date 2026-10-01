const express = require('express');
const FeedbackController = require('../controllers/FeedbackController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /feedbacks:
 *   post:
 *     summary: Enviar feedback
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
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Feedback registado
 *       400:
 *         description: Comentário obrigatório
 */
router.post('/', authMiddleware, FeedbackController.create);

module.exports = router;
