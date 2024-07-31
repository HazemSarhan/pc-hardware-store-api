const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide a rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide a review title'],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review text'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);

// Make sure user can leave only one review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to calculate the average rating and number of reviews
ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model('Product').findByIdAndUpdate(productId, {
      averageRating: Math.ceil(result[0]?.averageRating || 0),
      numOfReviews: result[0]?.numOfReviews || 0,
    });
  } catch (error) {
    console.error(error);
  }
};

// Hook to update review counts and average rating
ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.product);
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
