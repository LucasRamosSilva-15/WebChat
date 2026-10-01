const RoomService = require('../services/RoomService');
const { handleError } = require('./errorHandler');

class RoomController {
  async create(req, res) {
    try {
      const room = await RoomService.createRoom(req.body, req.userId);
      return res.status(201).json(room);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async list(req, res) {
    try {
      const rooms = await RoomService.getAllRooms();
      return res.status(200).json(rooms);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getById(req, res) {
    try {
      const room = await RoomService.getRoomById(req.params.id, req.userId);
      return res.status(200).json(room);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async remove(req, res) {
    try {
      const isAdmin = !!req.admin; // preenchido pelo middleware adminAuth
      const userId = isAdmin ? null : req.userId;
      const result = await RoomService.deleteRoom(req.params.id, userId, isAdmin);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async join(req, res) {
    try {
      const result = await RoomService.joinRoom(req.params.id, req.userId);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getMembers(req, res) {
    try {
      const members = await RoomService.getRoomMembers(req.params.id);
      return res.status(200).json(members);
    } catch (error) {
      return handleError(res, error);
    }
  }
}

module.exports = new RoomController();
