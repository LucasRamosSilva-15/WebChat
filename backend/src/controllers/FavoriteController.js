const FavoriteService = require('../services/FavoriteService');
const { handleError } = require('./errorHandler');

class FavoriteController {
  async list(req, res) {
    try {
      const favorites = await FavoriteService.getUserFavorites(req.userId);
      return res.status(200).json(favorites);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async create(req, res) {
    try {
      const { item_type, item_id, title, content, meta } = req.body;
      const favorite = await FavoriteService.addFavorite(req.userId, {
        item_type,
        item_id,
        title,
        content,
        meta
      });
      return res.status(201).json(favorite);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async remove(req, res) {
    try {
      const { itemType, itemId } = req.params;
      const result = await FavoriteService.removeFavorite(req.userId, itemType, itemId);
      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }
}

module.exports = new FavoriteController();
