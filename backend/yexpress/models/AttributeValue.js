const mongoose = require("mongoose");

const attributeValueSchema = new mongoose.Schema({
  attribute: { type: mongoose.Schema.Types.ObjectId, ref: "Attribute", required: true },
  value: { type: String, required: true },
  
});

module.exports = mongoose.model("AttributeValue", attributeValueSchema);
