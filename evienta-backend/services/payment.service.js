const Payment = require('../models/Payment');

module.exports = {
  async createPayment(data) {
    return await Payment.create(data);
  },
  async getPaymentById(id) {
    return await Payment.findByPk(id);
  },
  async updatePayment(id, data) {
    return await Payment.update(data, { where: { id } });
  },
  async listPayments(filter = {}) {
    return await Payment.findAll({ where: filter });
  },
};
