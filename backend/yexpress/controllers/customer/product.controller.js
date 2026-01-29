const mongoose = require("mongoose");
const Product = require("../../models/Product");
const ProductVariant = require("../../models/productVariant"); 
const {redisClient } = require("../../config/redis");
const logger = require("../../utils/logger");
const Category = require("../../models/Category");
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    logger.error("Error in getAllCategories:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getAllProduct = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search = "", 
      category, 
      sort = "newest", // newest, price-low, price-high, rating
      minPrice,
      maxPrice
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // 1. Build the Match Stage (Filtering)
    const matchStage = { deleted: false };

    // Search (Name or Description)
    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } }, // Case insensitive
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Category Filter
    if (category && mongoose.isValidObjectId(category)) {
      matchStage.category = new mongoose.Types.ObjectId(category);
    }

    // Price Filter (Base Price)
    if (minPrice || maxPrice) {
      matchStage.price = {};
      if (minPrice) matchStage.price.$gte = parseFloat(minPrice);
      if (maxPrice) matchStage.price.$lte = parseFloat(maxPrice);
    }

    // 2. Build Sort Stage
    let sortStage = { createdAt: -1 }; // Default: Newest
    if (sort === "price-low") sortStage = { price: 1 };
    if (sort === "price-high") sortStage = { price: -1 };
    if (sort === "rating") sortStage = { averageRating: -1 };

    // 3. Aggregation Pipeline
    const pipeline = [
      { $match: matchStage },
      // Lookup Category for display
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      
      // Lookup Variants (to get minPrice if variants exist)
      {
        $lookup: {
          from: "variants",
          localField: "_id",
          foreignField: "product",
          as: "variants"
        }
      },
      // Calculate minPrice: use variant min price if exists, else base price
      {
        $addFields: {
          minPrice: {
            $cond: {
              if: { $gt: [{ $size: "$variants" }, 0] },
              then: { $min: "$variants.price" },
              else: "$price"
            }
          }
        }
      },
      // Remove heavy variants array to save bandwidth
      { $project: { variants: 0 } },
      
      { $sort: sortStage },
      { $skip: skip },
      { $limit: parseInt(limit) }
    ];

    // Execute Query
    const products = await Product.aggregate(pipeline);
    
    // Get Total Count for Pagination
    const totalProducts = await Product.countDocuments(matchStage);

    res.status(200).json({
      success: true,
      data: {
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: parseInt(page)
      }
    });

  } catch (error) {
    console.error("Error in getAllProduct:", error);
    logger.error("Error in getAllProduct:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    // 1. Fetch the Product
    const product = await Product.findById(id).populate("category");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    // 2. Fetch Variants for this product
   const variants = await ProductVariant.find({ product: id })
  .populate("attributes.attribute") 
  .populate("attributes.value"); 

    // 3. Calculate Price Range (if variants exist)
    let priceRange = { min: product.price, max: product.price };
    if (variants.length > 0) {
      const prices = variants.map(v => v.price);
      priceRange = {
        min: Math.min(...prices),
        max: Math.max(...prices)
      };
    }

    res.status(200).json({
      success: true,
      data: {
        ...product.toObject(),
        variants,   
        priceRange  
      }
    });

  } catch (error) {
    console.error("Error in getProductById:", error);
    logger.error("Error in getProductById:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};