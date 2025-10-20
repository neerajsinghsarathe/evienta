const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const reviewValidator = require('../validators/review.validator');

router.post('/', reviewValidator.createReview, reviewController.createReview);
router.get('/', reviewController.listReviews);
router.get('/:id', reviewController.getReview);
router.put('/:id', reviewController.updateReview);

module.exports = router;
