const { User, VendorProfile } = require('../models');

module.exports = {
  async createUser(data) {
    return await User.create(data);
  },
  async getUserById(id) {
    return await User.findByPk(id, {
      include: VendorProfile
    });
  },
  async updateUser(id, data) {
    return await User.update(data, { where: { id } });
  },
  async deleteUser(id) {
    return await User.destroy({ where: { id } });
  },
  async listUsers(filter = {}) {
    return await User.findAll({ where: filter });
  },
};
