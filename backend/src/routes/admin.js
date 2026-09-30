const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const UsuarioController = require('../controllers/UsuarioController');
const RoomController = require('../controllers/RoomController');
const MessageController = require('../controllers/MessageController');
const ReportController = require('../controllers/ReportController');
const FeedbackController = require('../controllers/FeedbackController');

const router = express.Router();

// Todas as rotas abaixo exigem token de administrador.
router.use(adminAuth);

router.get('/users', UsuarioController.list);

router.get('/rooms', RoomController.list);
router.delete('/rooms/:id', RoomController.remove);

router.delete('/messages/:id', MessageController.remove);

router.get('/reports', ReportController.list);
router.put('/reports/:id', ReportController.updateStatus);
router.delete('/reports/:id', ReportController.remove);

router.get('/feedbacks', FeedbackController.list);
router.put('/feedbacks/:id', FeedbackController.updateStatus);
router.delete('/feedbacks/:id', FeedbackController.remove);

module.exports = router;
