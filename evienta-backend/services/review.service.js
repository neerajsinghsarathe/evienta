const Review = require('../models/Review');

module.exports = {
  async createReview(data) {
    return await Review.create(data);
  },
  async getReviewById(id) {
    return await Review.findByPk(id);
  },
  async updateReview(id, data) {
    return await Review.update(data, { where: { id } });
  },
  async listReviews(filter = {}) {
    return await Review.findAll({ where: filter });
  },
};
