const express = require('express');
const NotificationController = require('../controllers/NotificationController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, NotificationController.list);
router.post('/', authMiddleware, NotificationController.create);
router.patch('/read-all', authMiddleware, NotificationController.markAllAsRead);
router.patch('/:id/read', authMiddleware, NotificationController.markAsRead);
router.delete('/all', authMiddleware, NotificationController.clearAll);
router.delete('/:id', authMiddleware, NotificationController.remove);

module.exports = router;
