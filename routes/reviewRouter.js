const express = require('express');
const router = express.Router();
const { authenticatedUser } = require('../middleware/authentication');
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

router.route('/').get(getAllReviews).post([authenticatedUser], createReview);
router
  .route('/:id')
  .get([authenticatedUser], getReviewById)
  .patch([authenticatedUser], updateReview)
  .delete([authenticatedUser], deleteReview);

module.exports = router;
