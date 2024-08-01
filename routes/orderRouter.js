const express = require('express');
const router = express.Router();
const { authenticatedUser } = require('../middleware/authentication');
const {
  checkoutOrder,
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');

router.route('/checkout').post(authenticatedUser, checkoutOrder);

router
  .route('/')
  .post(authenticatedUser, createOrder)
  .get(authenticatedUser, getAllOrders);

router
  .route('/:id')
  .get(authenticatedUser, getOrderById)
  .patch(authenticatedUser, updateOrderStatus);

module.exports = router;
