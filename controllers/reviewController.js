const Review = require('../models/Review');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermission } = require('../utils');

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  // check for product availablity
  const isValidProduct = await Product.findById(productId);
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(
      `No product with this id: ${productId}`
    );
  }
  // check if the user submitted a review before or no
  const alreadySubmit = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmit) {
    throw new CustomError.BadRequestError(
      'Already submitted a review for this product'
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: 'product',
      select: 'name price',
    })
    .populate({
      path: 'user',
      select: 'name',
    });

  res.status(StatusCodes.OK).json({ reviews, reviewsCounter: reviews.length });
};

const getReviewById = async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new CustomError.NotFoundError(
      `No review found with this id: ${reviewId}`
    );
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review found with id: ${reviewId}`);
  }

  // Check if the user is the owner of the review
  checkPermission(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findOneAndDelete({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No review found with id: ${reviewId}`);
  }

  // Check if the user is the owner of the review
  checkPermission(req.user, review.user);
  res.status(StatusCodes.OK).json({ msg: 'Review removed!' });
};

const getSingleProductReviews = async (req, res) => {
  const productId = req.params.id;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, reviewsCounter: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
