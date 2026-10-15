const express = require('express');
const FavoriteController = require('../controllers/FavoriteController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, FavoriteController.list);
router.post('/', authMiddleware, FavoriteController.create);
router.delete('/:itemType/:itemId', authMiddleware, FavoriteController.remove);

module.exports = router;
