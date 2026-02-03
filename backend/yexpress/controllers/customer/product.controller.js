const mongoose = require("mongoose");
const Product = require("../../models/Product");
const ProductVariant = require("../../models/productVariant"); 
const Wishlist = require("../../models/Wishlist");
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
    const userId = req.user ? req.user._id : null; 

    // 1. Check Redis (Cache key now includes userId so users see their own wishlist state)
    const cacheKey = `products:list:${userId || 'guest'}:${JSON.stringify(req.query)}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) return res.status(200).json(JSON.parse(cachedData));

    const { 
      page = 1, limit = 12, search = "", category, 
      sort = "newest", minPrice, maxPrice 
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const matchStage = { deleted: false };

    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    if (category && mongoose.isValidObjectId(category)) {
      matchStage.category = new mongoose.Types.ObjectId(category);
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product",
          as: "variants"
        }
      },
      {
        $addFields: {
          price: { $ifNull: [{ $min: "$variants.price" }, 0] }
        }
      },
      // --- NEW: WISHLIST LOOKUP ---
      {
        $lookup: {
          from: "Wishlist", // Ensure this matches your MongoDB collection name
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", userId ? new mongoose.Types.ObjectId(userId) : null] },
                    { $eq: ["$product", "$$productId"] }
                  ]
                }
              }
            }
          ],
          as: "wishlistEntry"
        }
      },
      {
        $addFields: {
          isWishlisted: { $gt: [{ $size: "$wishlistEntry" }, 0] } // true if array has items
        }
      },
      { $project: { variants: 0, wishlistEntry: 0 } }, // Clean up temporary fields
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

    // ... Price Filtering and Sorting logic remains the same ...
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
      pipeline.push({ $match: { price: priceFilter } });
    }

    let sortStage = { createdAt: -1 };
    if (sort === "price-low") sortStage = { price: 1 };
    if (sort === "price-high") sortStage = { price: -1 };
    if (sort === "rating") sortStage = { averageRating: -1 };
    pipeline.push({ $sort: sortStage });

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
    const userId = req.user ? req.user.id : null;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const cacheKey = `product:detail:${userId || 'guest'}:${id}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) return res.status(200).json(JSON.parse(cachedData));

    // 1. Fetch Product and Wishlist status in parallel
    const [product, variants, wishlistEntry] = await Promise.all([
      Product.findById(id).populate("category").lean(),
      ProductVariant.find({ product: id }).populate("attributes.attribute").populate("attributes.value").lean(),
      userId ? Wishlist.findOne({ user: userId, product: id }).lean() : null
    ]);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const prices = variants.map(v => v.price);
    const price = prices.length > 0 ? Math.min(...prices) : 0;
    
    const response = {
      success: true,
      data: {
        ...product,
        variants,
        price,
        isWishlisted: !!wishlistEntry // Convert to boolean
      }
    };

    await redisClient.setEx(cacheKey, TTL_DETAIL, JSON.stringify(response));
    res.status(200).json(response);

  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};