const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createOrder = async (req, res) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    throw new CustomError.BadRequestError('Please provide products');
  }

  let totalAmount = 0;

  // Calculate total amount and validate stock
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new CustomError.NotFoundError(
        `No product found with id: ${item.product}`
      );
    }

    if (product.stock < item.quantity) {
      throw new CustomError.BadRequestError(
        `Only ${product.stock} items left in stock for product: ${product.name}`
      );
    }

    totalAmount += product.price * item.quantity;

    // Decrease the product stock
    product.stock -= item.quantity;
    await product.save();
  }

  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new CustomError.NotFoundError(
      `No user found with id: ${req.user.userId}`
    );
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // Stripe uses cents
    currency: 'usd',
    metadata: { integration_check: 'accept_a_payment' },
  });

  const order = await Order.create({
    products,
    user: req.user.userId,
    totalAmount,
    stripePaymentId: paymentIntent.id,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: paymentIntent.client_secret });
};
/*
create order with single product
const createOrder = async (req, res) => {
  const { product: productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product found with id: ${productId}`
    );
  }

  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new CustomError.NotFoundError(
      `No user found with id: ${req.user.userId}`
    );
  }

  // check for product availablity in stock or no
  if (product.stock < quantity) {
    throw new CustomError.BadRequestError(
      `Only ${product.stock} items left in stock`
    );
  }

  const totalAmount = product.price * quantity;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // Stripe uses cents
    currency: 'usd',
    metadata: { integration_check: 'accept_a_payment' },
  });

  const order = await Order.create({
    product: productId,
    user: req.user.userId,
    quantity,
    totalAmount,
    stripePaymentId: paymentIntent.id,
  });

  // Decrease the product stock
  product.stock -= quantity;
  await product.save();

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: paymentIntent.client_secret });
};
*/

const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('products.product').populate({
    path: 'user',
    select: 'username email role', // Exclude password
  });

  res.status(StatusCodes.OK).json({ orders, ordersCounter: orders.length });
};

const getOrderById = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findById(orderId)
    .populate('products.product')
    .populate({
      path: 'user',
      select: 'username email role', // Exclude password
    });

  if (!order) {
    throw new CustomError.NotFoundError(`No order found with id: ${orderId}`);
  }

  res.status(StatusCodes.OK).json({ order });
};

const updateOrderStatus = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentStatus } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new CustomError.NotFoundError(`No order found with id: ${orderId}`);
  }

  order.paymentStatus = paymentStatus;

  await order.save();
  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
