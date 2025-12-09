const mongoose = require("mongoose");
const Attribute = require("../../models/Attribute");
const AttributeValue = require("../../models/AttributeValue");

const addAttribute = async (req, res) => {
  try {
    const { name, category_id } = req.body;

    // Check if attribute already exists for the given product and category
    const existingAttribute = await Attribute.findOne({
      name,
      category: category_id,
    });
    if (existingAttribute) {
      return res
        .status(400)
        .json({
          message: "Attribute already exists for this product and category",
        });
    }
    // Create the attribute
    const attribute = await Attribute.create({
      name,
      category: category_id,
    });

    res
      .status(201)
      .json({ message: "Attribute created successfully", attribute });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAtributes = async (req, res) => {
  try {
    const attributes = await Attribute.find({ category: req.params.categoryID })
      .populate("product")
      .populate("category");
    res.status(200).json({ success: true, data: attributes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const editAttribute = async (req, res) => {
  try {
    const name = req.body;
    const attribute = Attribute.findById(req.params.attributeID);
    attribute.name = name;
    await attribute.save();
    res.status(200).json(attribute);
  } catch (error) {
    logger.error({ error: "error editing attribute", error });
    res.status(401).json({ error: "error editing attribute" });
  }
};
const deleteAttribute = async (req, res) => {
  try {
    const attributeID = req.params.attributeID;
    await Attribute.findByIdAndDelete(attributeID);
    res.status(200).json({ message: "attribute deleted successfully" });
  } catch (error) {
    logger.error({ error: "error deleting attribute", error });
    res.status(401).json({ error: "error deleting attribute" });
  }
};
module.exports = {
  getAllAtributes,
  addAttribute,
  editAttribute,
  deleteAttribute,
};
