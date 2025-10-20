const reviewService = require('../services/review.service');

exports.createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.body);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

exports.getReview = async (req, res, next) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const [updated] = await reviewService.updateReview(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Review not found or not updated' });
    const review = await reviewService.getReviewById(req.params.id);
    res.json(review);
  } catch (err) {
    next(err);
  }
};

exports.listReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.listReviews(req.query);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};
