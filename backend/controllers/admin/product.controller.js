const ProductVariant = require('../../models/ProductVariant');
const Attribute = require('../../models/Attribute');
const AttributeValue = require('../../models/AttributeValue');
const Product = require('../../models/product')
const logger = require('../../utils/logger')
const addProduct = async (req, res) => {
  try {
    const { name, description, category_id, variants } = req.body;

    // 1. Create the product
    const product = await Product.create({
      name,
      description,
      category: category_id,
    });

    // 2. Loop through variants
    for (const variant of variants) {
      const variantAttributes = [];

      for (const attr of variant.attributes) {
        // 3. Find the attribute under the category
        let attribute = await Attribute.findOne({
          name: attr.attribute,
          category: category_id,
          product: product._id
        });

        // If attribute does not exist, create it
        if (!attribute) {
          attribute = await Attribute.create({
            name: attr.attribute,
            category: category_id
          });
        }

        // 4. Find or create attribute value
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

      // 5. Create product variant
      await ProductVariant.create({
        product: product._id,
        price: variant.price,
        stock: variant.stock,
        attributes: variantAttributes,
      });
    }

    res.status(201).json({ message: "Product created successfully", product });

  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate({
        path: 'variants',
        populate: {
          path: 'attributes.attribute',
        },
      });

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const getAProductByID = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId)
      .populate({ 
        path: 'variants',
        populate: {
          path: 'attributes.attribute',
        },
      });

    res.status(200).json(product);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const updateAProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, category_id } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, category: category_id },
      { new: true }
    );

    res.status(200).json({ message: "Product updated successfully", updatedProduct });  
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
const deleteAProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = {
    addProduct,
    getAllProducts,
    getAProductByID,
    updateAProduct,
    deleteAProduct
}