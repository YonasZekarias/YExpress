const Category = require("../../models/Category");
const logger = require("../../utils/logger");

const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const categoryExist = await Category.findOne({ name });
        
        if (categoryExist) return res.status(400).json({ message: "Category already exists" });

        const category = await Category.create({ name });
        res.status(201).json({ success: true, data: category }); // FIX: 201 Created
    } catch (error) {
        logger.error("Add Category Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const allCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        logger.error("Fetch Categories Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getACategoryByID = async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryID);
        if (!category) return res.status(404).json({ message: "Category not found" });
        
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        logger.error("Fetch Category Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const editCategory = async (req, res) => {
    try {
        const { name } = req.body; // FIX: Destructure
        const category = await Category.findByIdAndUpdate(
            req.params.categoryID,
            { name },
            { new: true, runValidators: true }
        );

        if (!category) return res.status(404).json({ message: "Category not found" });

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        logger.error("Edit Category Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.categoryID);
        if (!category) return res.status(404).json({ message: "Category not found" });

        res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        logger.error("Delete Category Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addCategory,
    allCategories,
    editCategory,
    getACategoryByID,
    deleteCategory,
};