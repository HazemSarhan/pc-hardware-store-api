const express = require('express');
const router = express.Router();
const {
  authenticatedUser,
  authorizePermissions,
} = require('../middleware/authentication');
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  uploadImage,
} = require('../controllers/productController');
const { getSingleProductReviews } = require('../controllers/reviewController');

router
  .route('/')
  .post([authenticatedUser, authorizePermissions('admin')], createProduct)
  .get(getAllProducts);

router
  .route('/uploadImage')
  .post([authenticatedUser, authorizePermissions('admin')], uploadImage);

router
  .route('/:id')
  .get(getProductById)
  .patch([authenticatedUser, authorizePermissions('admin')], updateProduct)
  .delete([authenticatedUser, authorizePermissions('admin')], deleteProduct);

router.route('/:id/reviews').get(getSingleProductReviews);

module.exports = router;
