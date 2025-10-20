const express = require('express');
const router = express.Router();
const payoutController = require('../controllers/payout.controller');
const payoutValidator = require('../validators/payout.validator');

router.post('/', payoutValidator.createPayout, payoutController.createPayout);
router.get('/', payoutController.listPayouts);
router.get('/:id', payoutController.getPayout);
router.put('/:id', payoutController.updatePayout);

module.exports = router;
