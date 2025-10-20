const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const paymentValidator = require('../validators/payment.validator');

router.post('/', paymentValidator.createPayment, paymentController.createPayment);
router.get('/', paymentController.listPayments);
router.get('/:id', paymentController.getPayment);
router.put('/:id', paymentController.updatePayment);

module.exports = router;
