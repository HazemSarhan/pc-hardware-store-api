const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const checkoutOrder = async (req, res) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    throw new CustomError.BadRequestError('Please provide products');
  }

  let subtotal = 0;
  const orderItems = [];

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

    const orderItem = {
      name: product.name,
      image: product.image,
      price: product.price,
      amount: item.quantity,
      product: product._id,
    };

    orderItems.push(orderItem);
    subtotal += product.price * item.quantity;
  }

  const tax = subtotal * 0.15; // Example 15% tax
  const shippingFee = 10; // Example fixed shipping fee
  const total = subtotal + tax + shippingFee;

  res.status(StatusCodes.OK).json({
    orderItems,
    subtotal,
    tax,
    shippingFee,
    total,
  });
};

const createOrder = async (req, res) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    throw new CustomError.BadRequestError('Please provide products');
  }

  let subtotal = 0;
  const orderItems = [];

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

    const orderItem = {
      name: product.name,
      image: product.image,
      price: product.price,
      amount: item.quantity,
      product: product._id,
    };

    orderItems.push(orderItem);
    subtotal += product.price * item.quantity;

    // Decrease the product stock
    product.stock -= item.quantity;
    await product.save();
  }

  const tax = subtotal * 0.15; // Example 15% tax
  const shippingFee = 10; // Example fixed shipping fee
  const total = subtotal + tax + shippingFee;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total * 100, // Stripe uses cents
    currency: 'usd',
    metadata: { integration_check: 'accept_a_payment' },
  });

  const order = await Order.create({
    orderItems,
    user: req.user.userId,
    tax,
    shippingFee,
    subtotal,
    total,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: paymentIntent.client_secret });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email');
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getOrderById = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findById(orderId).populate('user', 'name email');
  if (!order) {
    throw new CustomError.NotFoundError(`No order found with id: ${orderId}`);
  }
  res.status(StatusCodes.OK).json({ order });
};

const updateOrderStatus = async (req, res) => {
  const { id: orderId } = req.params;
  const { status } = req.body;

  if (
    !status ||
    !['pending', 'failed', 'paid', 'delivered', 'canceled'].includes(status)
  ) {
    throw new CustomError.BadRequestError('Please provide a valid status');
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: false }
  );

  if (!order) {
    throw new CustomError.NotFoundError(`No order found with id: ${orderId}`);
  }

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  checkoutOrder,
};
