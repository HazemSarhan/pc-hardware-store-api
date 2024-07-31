const express = require('express');
const router = express.Router();
const { authenticatedUser } = require('../middleware/authentication');
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');

router
  .route('/')
  .post(authenticatedUser, createOrder)
  .get(authenticatedUser, getAllOrders);

router
  .route('/:id')
  .get(authenticatedUser, getOrderById)
  .patch(authenticatedUser, updateOrderStatus);

module.exports = router;
