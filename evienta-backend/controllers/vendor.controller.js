const vendorService = require('../services/vendor.service');

exports.createVendorProfile = async (req, res, next) => {
  try {
    const vendor = await vendorService.createVendorProfile(req.body);
    res.status(201).json(vendor);
  } catch (err) {
    next(err);
  }
};

exports.getVendor = async (req, res, next) => {
  try {
    const vendor = await vendorService.getVendorById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (err) {
    next(err);
  }
};

exports.updateVendor = async (req, res, next) => {
  try {
    const [updated] = await vendorService.updateVendor(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Vendor not found or not updated' });
    const vendor = await vendorService.getVendorById(req.params.id);
    res.json(vendor);
  } catch (err) {
    next(err);
  }
};

exports.listVendors = async (req, res, next) => {
  try {
    const vendors = await vendorService.listVendors(req.query);
    res.json(vendors);
  } catch (err) {
    next(err);
  }
};
