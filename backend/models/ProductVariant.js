const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  photo : [String],
  attributes: [
    {
      attribute: { type: mongoose.Schema.Types.ObjectId, ref: "Attribute" },
      value: { type: mongoose.Schema.Types.ObjectId, ref: "AttributeValue" },
    }
  ]
});

module.exports = mongoose.model("ProductVariant", productVariantSchema);
