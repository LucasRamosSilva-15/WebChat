const RoomService = require('../services/RoomService');

class RoomController {
  async create(req, res) {
    try {
      const userId = req.user.userId;
      const room = await RoomService.createRoom(req.body, userId);
      return res.status(201).json(room);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const rooms = await RoomService.getAllRooms();
      return res.status(200).json(rooms);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar salas.' });
    }
  }

  async getById(req, res) {
    try {
      const room = await RoomService.getRoomById(req.params.id);
      return res.status(200).json(room);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const userId = req.user.userId;
      const isAdmin = req.user.isAdmin || false;
      const result = await RoomService.deleteRoom(req.params.id, userId, isAdmin);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(403).json({ error: error.message });
    }
  }
}

module.exports = new RoomController();
