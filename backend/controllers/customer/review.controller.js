const Review= require('../../models/review');
const User = require('../../models/user.model');
const Product = require('../../models/Product')

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!productId || !rating) {
      return res.status(400).json({ message: 'Product ID and rating are required.' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Create review
    const review = new Review({
      product: productId,
      user: userId,
      rating,
      comment,
    });

    await review.save();

    // Update product's average rating
    await Product.updateOne(
      { _id: productId },
      { $push: { reviews: review._id }, $inc: { ratingsCount: 1 } },
      { $set: { averageRating: (product.averageRating * product.ratingsCount + rating) / (product.ratingsCount + 1) } }
    );

    res.status(201).json({
      message: 'Review created successfully.',
      review,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
module.exports = {
  createReview,
};