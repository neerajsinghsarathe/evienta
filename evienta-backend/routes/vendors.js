const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor.controller');
const vendorValidator = require('../validators/vendor.validator');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth, vendorValidator.createVendorProfile, vendorController.createVendorProfile);
router.post('/bulk', vendorValidator.bulkCreateVendorProfiles, vendorController.bulkCreateVendorProfiles);
router.get('/', vendorController.listVendors);
router.get('/:id', vendorController.getVendor);
router.put('/:id', vendorController.updateVendor);

module.exports = router;
