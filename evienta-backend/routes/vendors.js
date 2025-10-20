const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor.controller');
const vendorValidator = require('../validators/vendor.validator');

router.post('/', vendorValidator.createVendorProfile, vendorController.createVendorProfile);
router.get('/', vendorController.listVendors);
router.get('/:id', vendorController.getVendor);
router.put('/:id', vendorController.updateVendor);

module.exports = router;
