const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const serviceValidator = require('../validators/service.validator');

router.post('/', serviceValidator.createService, serviceController.createService);
router.get('/', serviceController.listServices);
router.get('/:id', serviceController.getService);
router.put('/:id', serviceController.updateService);

module.exports = router;
