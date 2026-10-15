const { Favorite } = require('../models');

class FavoriteRepository {
  async findByUser(userId) {
    return await Favorite.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });
  }

  async findOne(userId, item_type, item_id) {
    return await Favorite.findOne({
      where: {
        user_id: userId,
        item_type,
        item_id
      }
    });
  }

  async create(data) {
    return await Favorite.create(data);
  }

  async delete(userId, item_type, item_id) {
    return await Favorite.destroy({
      where: {
        user_id: userId,
        item_type,
        item_id
      }
    });
  }

  async deleteById(id, userId) {
    return await Favorite.destroy({
      where: {
        id,
        user_id: userId
      }
    });
  }
}

module.exports = new FavoriteRepository();
