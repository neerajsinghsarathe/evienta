const bookingService = require('../services/booking.service');

exports.createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const [updated] = await bookingService.updateBooking(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Booking not found or not updated' });
    const booking = await bookingService.getBookingById(req.params.id);
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

exports.listBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.listBookings(req.query);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};
