const Product = require("../../models/Product");
const ProductVariant = require("../../models/ProductVariant");
const Attribute = require("../../models/Attribute");
const AttributeValue = require("../../models/AttributeValue");
const logger = require("../../utils/logger");
const buildProductQuery = require("../../utils/productQueryBuilder");
const mongoose = require("mongoose");
const { redisClient } = require("../../config/redis");
const {
  invalidateAfterProductMutation,
} = require("../../utils/invalidateProductCaches");

async function buildVariantAttributes(category_id, variant) {
  const variantAttributes = [];
  if (!variant.attributes || !Array.isArray(variant.attributes)) {
    return variantAttributes;
  }

  for (const attr of variant.attributes) {
    let attribute = await Attribute.findOne({
      name: attr.attribute,
      category: category_id,
    });

    if (!attribute) {
      attribute = await Attribute.create({
        name: attr.attribute,
        category: category_id,
      });
    }

    let attributeValue = await AttributeValue.findOne({
      attribute: attribute._id,
      value: attr.value,
    });

    if (!attributeValue) {
      attributeValue = await AttributeValue.create({
        attribute: attribute._id,
        value: attr.value,
      });
    }

    variantAttributes.push({
      attribute: attribute._id,
      value: attributeValue._id,
    });
  }

  return variantAttributes;
}

const addProduct = async (req, res) => {
  try {
    const { name, description, category_id, photo, variants } = req.body;

    const product = await Product.create({
      name,
      description,
      category: category_id,
      photo: Array.isArray(photo) ? photo : [],
    });

    for (const variant of variants) {
      const variantAttributes = await buildVariantAttributes(
        category_id,
        variant
      );

      await ProductVariant.create({
        product: product._id,
        price: variant.price,
        stock: variant.stock,
        photo: Array.isArray(variant.photo) ? variant.photo : [],
        attributes: variantAttributes,
      });
    }

    await invalidateAfterProductMutation(redisClient, {
      productId: String(product._id),
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    logger.error("Add Product Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const pipeline = buildProductQuery(req.query);

    const products = await Product.aggregate(pipeline);

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

    const product = await Product.findById(productId);

    const variants = await ProductVariant.find({ product: productId })
      .populate("attributes.attribute", "name")
      .populate("attributes.value", "value");

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({
      success: true,
      data: { ...product.toObject(), variants },
    });
  } catch (err) {
    logger.error("Get Product ID Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateAProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, category_id, photo, variants } = req.body;

    const updateFields = { name, description, category: category_id };
    if (photo !== undefined) {
      updateFields.photo = Array.isArray(photo) ? photo : [];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedProduct)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    if (variants !== undefined && Array.isArray(variants)) {
      if (variants.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one variant is required",
        });
      }

      const submittedIds = variants
        .filter((v) => v._id && mongoose.isValidObjectId(v._id))
        .map((v) => String(v._id));

      const existingVariants = await ProductVariant.find({ product: productId });
      for (const doc of existingVariants) {
        if (!submittedIds.includes(String(doc._id))) {
          await ProductVariant.findByIdAndDelete(doc._id);
        }
      }

      for (const variant of variants) {
        const variantAttributes = await buildVariantAttributes(
          category_id,
          variant
        );

        if (variant._id && mongoose.isValidObjectId(variant._id)) {
          const owned = await ProductVariant.findOne({
            _id: variant._id,
            product: productId,
          });
          if (!owned) continue;

          const vUpdate = {
            price: variant.price,
            stock: variant.stock,
            attributes: variantAttributes,
          };
          if (variant.photo !== undefined) {
            vUpdate.photo = Array.isArray(variant.photo) ? variant.photo : [];
          }
          await ProductVariant.findByIdAndUpdate(variant._id, vUpdate);
        } else {
          await ProductVariant.create({
            product: productId,
            price: variant.price,
            stock: variant.stock,
            photo: Array.isArray(variant.photo) ? variant.photo : [],
            attributes: variantAttributes,
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Product updated",
      data: updatedProduct,
    });
  } catch (error) {
    logger.error("Update Product Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteAProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    await ProductVariant.deleteMany({ product: productId });

    await invalidateAfterProductMutation(redisClient, {
      productId: String(productId),
    });

    res.status(200).json({
      success: true,
      message: "Product and variants deleted successfully",
    });
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
  deleteAProduct,
};
