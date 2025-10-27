const VendorProfile = require('../models/VendorProfile');

module.exports = {
  async createVendorProfile(data) {
    return await VendorProfile.create(data);
  },
  async getVendorById(id) {
    return await VendorProfile.findByPk(id);
  },
  async updateVendor(id, data) {
    return await VendorProfile.update(data, { where: { id } });
  },
  async listVendors(filter = {}) {
    return await VendorProfile.findAll({ where: filter });
  },
  async bulkCreateVendors(organizations) {
    return await VendorProfile.bulkCreate(organizations);
  }

};
