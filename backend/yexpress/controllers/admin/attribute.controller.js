const Attribute = require("../../models/Attribute");
const logger = require("../../utils/logger"); 

const addAttribute = async (req, res) => {
  try {
    const { name, category_id } = req.body;

    if (!name || !category_id) {
        return res.status(400).json({ message: "Name and Category ID are required" });
    }

    const existingAttribute = await Attribute.findOne({ name, category: category_id });
    
    if (existingAttribute) {
      return res.status(400).json({ message: "Attribute already exists for this category" });
    }

    const attribute = await Attribute.create({ name, category: category_id });

    res.status(201).json({ success: true, message: "Attribute created", data: attribute });
  } catch (error) {
    logger.error("Add Attribute Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllAttributes = async (req, res) => { // Fixed spelling 'Atributes' -> 'Attributes'
  try {
    const attributes = await Attribute.find({ category: req.params.categoryID })
      .populate("category", "name"); // Only populate necessary fields
      
    res.status(200).json({ success: true, count: attributes.length, data: attributes });
  } catch (error) {
    logger.error("Get Attributes Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const editAttribute = async (req, res) => {
  try {
    const { name } = req.body; // FIX: Destructure name from body
    
    const attribute = await Attribute.findByIdAndUpdate(
        req.params.attributeID,
        { name },
        { new: true, runValidators: true }
    );

    if (!attribute) return res.status(404).json({ message: "Attribute not found" });

    res.status(200).json({ success: true, data: attribute });
  } catch (error) {
    logger.error("Edit Attribute Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAttribute = async (req, res) => {
  try {
    const attribute = await Attribute.findByIdAndDelete(req.params.attributeID);
    
    if (!attribute) return res.status(404).json({ message: "Attribute not found" });

    res.status(200).json({ success: true, message: "Attribute deleted successfully" });
  } catch (error) {
    logger.error("Delete Attribute Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllAttributes,
  addAttribute,
  editAttribute,
  deleteAttribute,
};