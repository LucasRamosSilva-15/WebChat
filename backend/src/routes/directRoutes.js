const express = require('express');
const DirectController = require('../controllers/DirectController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/conversations', authMiddleware, DirectController.listConversations);
router.post('/conversations', authMiddleware, DirectController.getOrCreate);
router.get('/conversations/:id/messages', authMiddleware, DirectController.listMessages);
router.post('/conversations/:id/messages', authMiddleware, DirectController.sendMessage);
router.delete('/conversations/:id', authMiddleware, DirectController.removeConversation);
router.get('/users', authMiddleware, DirectController.listUsers);

module.exports = router;
