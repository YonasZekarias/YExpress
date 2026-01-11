const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  name: { type: String, required: true },
});

module.exports = mongoose.model("Attribute", attributeSchema);
