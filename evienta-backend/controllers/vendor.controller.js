const vendorService = require('../services/vendor.service');

exports.createVendorProfile = async (req, res, next) => {
  try {
    const organization = req.body;
    organization.user_id = req.user.id; // Associate vendor profile with authenticated user
    const result = await vendorService.createVendorProfile(organization);
    return res.status(201).send(result);
  } catch (e) {
    next(e);
  }
};

exports.bulkCreateVendorProfiles = async (req, res, next) => {
  try {
    const { organizations } = req.body;
    const result = await vendorService.bulkCreateVendors(organizations);
    return res.status(201).send(result);
  } catch (e) {
    next(e);
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

exports.uploadImagesForVendor = async (req, res, next) => {
  try {
    const files = req.files;
    res.json(files);
  } catch (err) {
    next(err);
  }
};
