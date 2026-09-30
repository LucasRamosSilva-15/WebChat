const express = require('express');
const ReportController = require('../controllers/ReportController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Denunciar uma mensagem
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message_id, reason]
 *             properties:
 *               message_id:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Denúncia registada
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authMiddleware, ReportController.create);

module.exports = router;
