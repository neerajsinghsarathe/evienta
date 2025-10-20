const Service = require('../models/Service');

module.exports = {
  async createService(data) {
    return await Service.create(data);
  },
  async getServiceById(id) {
    return await Service.findByPk(id);
  },
  async updateService(id, data) {
    return await Service.update(data, { where: { id } });
  },
  async listServices(filter = {}) {
    return await Service.findAll({ where: filter });
  },
};
