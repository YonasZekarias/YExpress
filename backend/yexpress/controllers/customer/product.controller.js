const mongoose = require("mongoose");
const Product = require("../../models/Product");
const ProductVariant = require("../../models/productVariant"); // Check file path casing!
const Category = require("../../models/Category");
const { redisClient } = require("../../config/redis");
const logger = require("../../utils/logger");

// Cache Durations
const TTL_CATEGORIES = 3600; 
const TTL_PRODUCTS = 300;    
const TTL_DETAIL = 600;      

exports.getAllCategories = async (req, res) => {
  try {
    const cacheKey = "categories:all";
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) return res.status(200).json(JSON.parse(cachedData));

    const categories = await Category.find({}).sort({ name: 1 });
    
    await redisClient.setEx(cacheKey, TTL_CATEGORIES, JSON.stringify({ success: true, data: categories }));
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    // 1. Check Redis
    const cacheKey = `products:list:${JSON.stringify(req.query)}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) return res.status(200).json(JSON.parse(cachedData));

    const { 
      page = 1, limit = 12, search = "", category, 
      sort = "newest", minPrice, maxPrice 
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const matchStage = { deleted: false };

    // Filters
    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    if (category && mongoose.isValidObjectId(category)) {
      matchStage.category = new mongoose.Types.ObjectId(category);
    }

    // 2. Aggregation Pipeline
    const pipeline = [
      { $match: matchStage },
      
      // --- FIX: LOOKUP CORRECT COLLECTION ---
      // Mongoose models named "ProductVariant" usually create a collection named "productvariants".
      {
        $lookup: {
          from: "productvariants", // <--- CHANGED from "variants" to "productvariants"
          localField: "_id",
          foreignField: "product",
          as: "variants"
        }
      },
      
      // --- FIX: PRICE LOGIC ---
      // Since you want "The Price", we grab the minimum price found in variants.
      // If no variants exist, it defaults to 0.
      {
        $addFields: {
          price: { 
            $ifNull: [{ $min: "$variants.price" }, 0] 
          }
        }
      },
      
      // Remove heavy variants array
      { $project: { variants: 0 } },

      // Populate Category
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } }
    ];

    // 3. Price Filter (Applied after we calculated price)
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
      pipeline.push({ $match: { price: priceFilter } });
    }

    // 4. Sort
    let sortStage = { createdAt: -1 };
    if (sort === "price-low") sortStage = { price: 1 };
    if (sort === "price-high") sortStage = { price: -1 };
    if (sort === "rating") sortStage = { averageRating: -1 };
    pipeline.push({ $sort: sortStage });

    // 5. Pagination Facet
    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: parseInt(limit) }]
      }
    });

    const result = await Product.aggregate(pipeline);
    const products = result[0].data;
    const totalProducts = result[0].metadata[0] ? result[0].metadata[0].total : 0;

    const response = {
      success: true,
      data: {
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: parseInt(page)
      }
    };

    await redisClient.setEx(cacheKey, TTL_PRODUCTS, JSON.stringify(response));
    res.status(200).json(response);

  } catch (error) {
    console.error("Error in getAllProduct:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const cacheKey = `product:detail:${id}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) return res.status(200).json(JSON.parse(cachedData));

    // 1. Fetch Product
    const product = await Product.findById(id).populate("category").lean();
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 2. Fetch Variants
    const variants = await ProductVariant.find({ product: id })
      .populate("attributes.attribute")
      .populate("attributes.value")
      .lean();

    // 3. Attach Price (Min price from variants)
    const prices = variants.map(v => v.price);
    const price = prices.length > 0 ? Math.min(...prices) : 0;
    
    product.price = price;

    const response = {
      success: true,
      data: {
        ...product,
        variants,
        price
      }
    };

    await redisClient.setEx(cacheKey, TTL_DETAIL, JSON.stringify(response));
    res.status(200).json(response);

  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};