const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const bookingValidator = require('../validators/booking.validator');

router.post('/', bookingValidator.createBooking, bookingController.createBooking);
router.get('/', bookingController.listBookings);
router.get('/:id', bookingController.getBooking);
router.put('/:id', bookingController.updateBooking);

module.exports = router;
