const Payout = require('../models/Payout');

module.exports = {
  async createPayout(data) {
    return await Payout.create(data);
  },
  async getPayoutById(id) {
    return await Payout.findByPk(id);
  },
  async updatePayout(id, data) {
    return await Payout.update(data, { where: { id } });
  },
  async listPayouts(filter = {}) {
    return await Payout.findAll({ where: filter });
  },
};
