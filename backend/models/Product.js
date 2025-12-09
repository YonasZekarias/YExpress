const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String },
  photo: [String],
  deleted: { type: Boolean, default: false },
  ratingsCount: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  averageRating: { type: Number, default: 0 },
});


const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
