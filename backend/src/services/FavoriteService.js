const FavoriteRepository = require('../repositories/FavoriteRepository');
const RoomRepository = require('../repositories/RoomRepository');

class FavoriteService {
  async getUserFavorites(userId) {
    if (!userId) {
      throw new Error('Usuário não autenticado.');
    }

    const favorites = await FavoriteRepository.findByUser(userId);
    const rooms = [];
    const messages = [];

    for (const fav of favorites) {
      if (fav.item_type === 'room') {
        let roomData = null;
        try {
          roomData = await RoomRepository.findById(fav.item_id);
        } catch {
          roomData = null;
        }

        rooms.push({
          id: fav.id,
          roomId: fav.item_id,
          name: fav.title || roomData?.name || 'Sala',
          description: fav.content || roomData?.description || '',
          category: roomData?.category || 'Geral',
          type: roomData?.type || 'public',
          favoritedAt: fav.created_at
        });
      } else if (fav.item_type === 'message') {
        let metaObj = {};
        if (fav.meta) {
          try {
            metaObj = JSON.parse(fav.meta);
          } catch {
            metaObj = {};
          }
        }

        messages.push({
          id: fav.id,
          messageId: fav.item_id,
          roomId: metaObj.roomId || null,
          roomName: metaObj.roomName || 'Sala',
          sender: fav.title || 'Usuário',
          text: fav.content || '',
          time: metaObj.time || '',
          favoritedAt: fav.created_at
        });
      }
    }

    return { rooms, messages };
  }

  async addFavorite(userId, { item_type, item_id, title, content, meta }) {
    if (!userId) {
      throw new Error('Usuário não autenticado.');
    }
    if (!item_type || !item_id) {
      throw new Error('Tipo e ID do item favorito são obrigatórios.');
    }

    const existing = await FavoriteRepository.findOne(userId, item_type, String(item_id));
    if (existing) {
      return existing;
    }

    const metaString = typeof meta === 'object' ? JSON.stringify(meta) : (meta || null);

    return await FavoriteRepository.create({
      user_id: userId,
      item_type,
      item_id: String(item_id),
      title: title || null,
      content: content || null,
      meta: metaString
    });
  }

  async removeFavorite(userId, item_type, item_id) {
    if (!userId) {
      throw new Error('Usuário não autenticado.');
    }
    if (!item_type || !item_id) {
      throw new Error('Tipo e ID do item favorito são obrigatórios.');
    }

    await FavoriteRepository.delete(userId, item_type, String(item_id));
    return { success: true };
  }
}

module.exports = new FavoriteService();
