import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  name: { type: String, required: true },
});

export default mongoose.model("Attribute", attributeSchema);
