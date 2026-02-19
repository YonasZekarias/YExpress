const Product = require('../../models/Product'); // Ensure capitalized consistency
const ProductVariant = require('../../models/productVariant'); // Check file name casing
const Attribute = require('../../models/Attribute');
const AttributeValue = require('../../models/AttributeValue');
const logger = require('../../utils/logger');
const buildProductQuery = require("../../utils/productQueryBuilder");

const addProduct = async (req, res) => {
  try {
    const { name, description, category_id, variants } = req.body;

    // 1. Create the base product
    const product = await Product.create({
      name,
      description,
      category: category_id,
    });

    // 2. Process Variants (Optimized)
    // Note: In production, consider using a Transaction (session) here
    for (const variant of variants) {
      const variantAttributes = [];

      for (const attr of variant.attributes) {
        
        // Find Attribute (Scoped to Category usually, not Product)
        // If attributes like "Size" are global to a category:
        let attribute = await Attribute.findOne({
          name: attr.attribute,
          category: category_id
        });

        if (!attribute) {
          attribute = await Attribute.create({
            name: attr.attribute,
            category: category_id
          });
        }

        // Find/Create Attribute Value
        let attributeValue = await AttributeValue.findOne({
          attribute: attribute._id,
          value: attr.value
        });

        if (!attributeValue) {
          attributeValue = await AttributeValue.create({
            attribute: attribute._id,
            value: attr.value
          });
        }

        variantAttributes.push({
          attribute: attribute._id,
          value: attributeValue._id
        });
      }

      // Create the Variant
      await ProductVariant.create({
        product: product._id,
        price: variant.price,
        stock: variant.stock,
        attributes: variantAttributes,
      });
    }

    res.status(201).json({ success: true, message: "Product created successfully", data: product });

  } catch (err) {
    logger.error("Add Product Error:", err);
    // If product was created but variants failed, you might want to delete the product here (rollback)
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const pipeline = buildProductQuery(req.query);
    
    const products = await Product.aggregate(pipeline);

    // Pagination Logic
    let nextCursor = null;
    if (products.length > limit) {
      nextCursor = products[limit - 1]._id;
      products.pop();
    }

    res.status(200).json({
      success: true,
      nextCursor,
      results: products.length,
      data: products,
    });
  } catch (err) {
    logger.error("Get All Products Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAProductByID = async (req, res) => {
  try {
    const productId = req.params.id;
    // Note: Ensure your Product model has a virtual named 'variants' or matches 'ProductVariant'
    const product = await Product.findById(productId);
    
    // Manual population if virtuals aren't set up, or use virtual populate
    // Assuming you want to find variants associated with this product:
    const variants = await ProductVariant.find({ product: productId })
        .populate('attributes.attribute', 'name')
        .populate('attributes.value', 'value');

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ 
        success: true, 
        data: { ...product.toObject(), variants } 
    });
  } catch (err) {
    logger.error("Get Product ID Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateAProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, category_id } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, category: category_id },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product updated", data: updatedProduct });  
  } catch (error) {
    logger.error("Update Product Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteAProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // CLEANUP: Delete associated variants
    await ProductVariant.deleteMany({ product: productId });

    res.status(200).json({ success: true, message: "Product and variants deleted successfully" });
  } catch (error) {
    logger.error("Delete Product Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
    addProduct,
    getAllProducts,
    getAProductByID,
    updateAProduct,
    deleteAProduct
};