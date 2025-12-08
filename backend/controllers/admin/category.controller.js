const Category = require("../../models/Category")

const addCategory = async (req, res) =>{
    try {
        const {name} = req.body;
        const categoryExist = await Category.findOne({name})
        if (categoryExist) return res.status(400).json({error : "category already exists"})
        const category = await Category.create({
            name
        })
        res.status(401).json(category)
    } catch (error) {
        logger.error({error: "error creating category", error})
        res.status(401).json({error : "error creating category"})
    }
}
const allCategories = async (req, res) =>{
    try {
        const categories = await Category.find()
        if(!categories) res.status(400).json({error : "error fetching categories"})
        res.status(200).json(categories)
    } catch (error) {
        logger.error({error: "error fetching categories"})
        res.status(401).json({error : "error fetching categories"})
    }
}
const getACategoryByID = async (req, res) =>{
    try {
        const categoryID = req.params.categoryID;
        const category = await Category.findById(categoryID)
        res.status(200).json(category)      
    } catch (error) {
        logger.error({error: "error fetching category", error})
        res.status(401).json({error : "error fetching category"})
    }
};

const editCategory = async (req, res) =>{
    try {
        const name = req.body;
        const category = Category.findById(req.params.categoryID)
        category.name = name;
        await category.save();
        res.status(200).json(category)      
    } catch (error) {
        logger.error({error: "error editing category", error})
        res.status(401).json({error : "error editing category"})
    }
}
const deleteCategory = async (req, res) =>{
    try{
        const categoryID = req.params.categoryID;
        await Category.findByIdAndDelete(categoryID)
        res.status(200).json({message : "category deleted successfully"});
    } catch (error) {
        logger.error({error: "error deleting category", error})
        res.status(401).json({error : "error deleting category"})
    }
}
module.exports = {
    addCategory,
    allCategories,
    editCategory,
    getACategoryByID,
    deleteCategory,
}