const mongoose = require("mongoose");
const Product = require("../../models/Product");
const ProductVariant = require("../../models/productVariant"); 
const {redisClient } = require("../../config/redis");
const logger = require("../../utils/logger");

exports.getAllProduct = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    
    // Cache key remains based on query params
    const cacheKey = `products:${category || 'all'}:page=${page}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      logger.info(`Cache hit for ${cacheKey}`);
      return res.status(200).json({ success: true, cached: true, data: JSON.parse(cached) });
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    // 1. Build the Match Stage (Filtering)
    const matchStage = { deleted: false };
    if (category) {
        // Ensure category is cast to ObjectId for aggregation
        matchStage.category = new mongoose.Types.ObjectId(category);
    }

    // 2. Aggregation Pipeline
    const pipeline = [
      { $match: matchStage },
      
      // Lookup Variants to get pricing
      {
        $lookup: {
          from: "productvariants", // Mongoose creates lowercase plural collection names by default
          localField: "_id",
          foreignField: "product",
          as: "variants"
        }
      },
      
      // Calculate Min/Max Price from the variants array
      {
        $addFields: {
          minPrice: { $min: "$variants.price" },
          maxPrice: { $max: "$variants.price" },
          totalStock: { $sum: "$variants.stock" },
          variantCount: { $size: "$variants" }
        }
      },

      // Lookup Category (Simulate .populate('category'))
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData"
        }
      },
      { $unwind: { path: "$categoryData", preserveNullAndEmptyArrays: true } },

      // Clean up the output (remove heavy variants array, keep calculated fields)
      {
        $project: {
          name: 1,
          description: 1,
          photo: 1,
          ratingsCount: 1,
          averageRating: 1,
          minPrice: 1,
          maxPrice: 1,
          totalStock: 1,
          category: "$categoryData", // Replace ID with object
        }
      },

      // Pagination using $facet
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: Number(limit) }]
        }
      }
    ];

    const results = await Product.aggregate(pipeline);

    // Extract data from facet result
    const products = results[0].data;
    const total = results[0].metadata[0] ? results[0].metadata[0].total : 0;
    const totalPages = Math.ceil(total / limit);

    const responseData = { products, total, totalPages, currentPage: Number(page) };

    // Cache the result
    await redisClient.setEx(cacheKey, 600, JSON.stringify(responseData));

    res.status(200).json({ success: true, cached: false, data: responseData });

  } catch (error) {
    console.log("Error in getAllProduct:", error);
    logger.error({ error: "Error fetching products", details: error });
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const cacheKey = `product:${productId}`;
    console.log("🔍 FETCHING PRODUCT ID:", productId);
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info(`Cache hit for ${cacheKey}`);
      return res.status(200).json({ success: true, cached: true, data: JSON.parse(cached) });
    }

    // 1. Fetch Basic Product Info
    const product = await Product.findById(productId)
      .populate('category')
      .lean();

    if (!product || product.deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 2. Fetch All Variants for this Product
    // We populate attributes so the frontend can display "Size: Large", "Color: Red"
    const variants = await ProductVariant.find({ product: productId })
      .populate({
        path: 'attributes.attribute',
        select: 'name'
      })
      .populate({
        path: 'attributes.value',
        select: 'value'
      })
      .lean();

    // 3. Combine Data
    // We calculate the price range again here for the detail page header
    const prices = variants.map(v => v.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    const result = {
      ...product,
      variants, // Frontend can now map over these to make a selector
      priceRange: { min: minPrice, max: maxPrice }
    };

    await redisClient.setEx(cacheKey, 900, JSON.stringify(result));

    res.status(200).json({ success: true, cached: false, data: result });

  } catch (error) {
    logger.error({ error: "Error fetching product", details: error });
    res.status(500).json({ success: false, message: error.message });
  }
};