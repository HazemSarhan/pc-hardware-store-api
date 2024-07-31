const mongoose = require('mongoose');
const Review = require('../models/Review');

const SpecificationSchema = new mongoose.Schema(
  {
    key: String,
    value: String,
  },
  { _id: true, id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a valid product name'],
    },
    brand: {
      type: String,
      required: [true, 'Please provide a valid product brand'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a valid product price'],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide a valid product stock'],
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    specifications: [SpecificationSchema],
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Pre middleware for removing associated reviews when a product is deleted
ProductSchema.pre('findOneAndDelete', async function (next) {
  const productId = this.getFilter()['_id'];
  await Review.deleteMany({ product: productId });
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
