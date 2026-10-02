const { User } = require('../models');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async create(userData) {
    return await User.create(userData);
  }

  async findAll() {
    return await User.findAll({
      attributes: { exclude: ['password'] }
    });
  }

  async countAll() {
    return await User.count();
  }

  async countBanned() {
    return await User.count({ where: { status: 'banned' } });
  }

  async update(id, updateData) {
    const user = await this.findById(id);
    if (!user) return null;
    return await user.update(updateData);
  }

  async delete(id) {
    const user = await this.findById(id);
    if (!user) return false;
    await user.destroy();
    return true;
  }
}

module.exports = new UserRepository();
