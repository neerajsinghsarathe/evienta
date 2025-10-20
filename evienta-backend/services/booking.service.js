const Booking = require('../models/Booking');

module.exports = {
  async createBooking(data) {
    return await Booking.create(data);
  },
  async getBookingById(id) {
    return await Booking.findByPk(id);
  },
  async updateBooking(id, data) {
    return await Booking.update(data, { where: { id } });
  },
  async listBookings(filter = {}) {
    return await Booking.findAll({ where: filter });
  },
};
