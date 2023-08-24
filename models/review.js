const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
