const { VendorProfile, Media, Package } = require('../models');
const db = require('../models');

module.exports = {
  async createVendorProfile(data) {
    const transaction = await db.sequelize.transaction();
    try {
      const vendor = await VendorProfile.create(data, { transaction });
      const pricing_packages = data.pricing_packages.map(_package => ({ ..._package, vendor_id: vendor.id }));
      await Package.bulkCreate(pricing_packages || [], { transaction });
      // const mediaFiles = data.images.map(image => ({
      //   vendor_id: vendor.id,
      //   url: image,
      //   type: 'image',
      //   description: ''
      // }));
      // await Media.bulkCreate(mediaFiles || [], { transaction });
      await transaction.commit();
      return vendor;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
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
