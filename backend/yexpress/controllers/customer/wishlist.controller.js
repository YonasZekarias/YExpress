const mongoose = require("mongoose");
const Wishlist = require("../models/Wishlist");
// Ensure these models are registered even if not used directly here
const Product = require("../models/Product"); 
const ProductVariant = require("../models/ProductVariant"); 
const { redisClient } = require("../config/redis");

// 1. ADD TO WISHLIST (Atomic & Fast)
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    // Atomic Update: Creates wishlist if missing, adds ID if not present
    await Wishlist.findOneAndUpdate(
      { user: userId },
      { $addToSet: { products: productId } }, 
      { new: true, upsert: true }
    );

    // Clear Cache
    await redisClient.del(`wishlist:user:${userId}`);

    res.status(200).json({ success: true, message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET WISHLIST (The Complex Part - Gets Prices automatically)
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const cacheKey = `wishlist:user:${userId}`;

    // Check Cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Aggregation Pipeline
    const wishlistData = await Wishlist.aggregate([
      // A. Match User's Wishlist
      { $match: { user: new mongoose.Types.ObjectId(userId) } },

      // B. Lookup Product Details (Array of IDs -> Array of Objects)
      {
        $lookup: {
          from: "products", 
          localField: "products",
          foreignField: "_id",
          as: "productObjects"
        }
      },

      // C. Unwind to process each product individually
      { $unwind: "$productObjects" },

      // D. Filter out deleted products (Safety check)
      { $match: { "productObjects.deleted": false } },

      // E. LOOKUP VARIANTS (To get Price)
      {
        $lookup: {
          from: "productvariants", // matches mongoose.model("ProductVariant")
          localField: "productObjects._id",
          foreignField: "product",
          as: "variants"
        }
      },

      // F. CALCULATE PRICE (Take Min Variant Price)
      {
        $addFields: {
          "productObjects.price": {
            $ifNull: [{ $min: "$variants.price" }, 0]
          },
          // Ensure we have a photo to show (Product photo OR Variant photo)
          "productObjects.displayPhoto": {
             $ifNull: [
               { $arrayElemAt: ["$productObjects.photo", 0] }, 
               { $arrayElemAt: ["$variants.photo", 0] } // Fallback to variant photo
             ]
          }
        }
      },

      // G. Group back into a clean list
      {
        $group: {
          _id: "$_id",
          products: { $push: "$productObjects" }
        }
      },

      // H. Clean up the output
      {
        $project: {
          _id: 0,
          products: {
            _id: 1,
            name: 1,
            price: 1, // <--- Correct Calculated Price
            photo: 1,
            displayPhoto: 1,
            slug: 1,
            averageRating: 1
          }
        }
      }
    ]);

    const products = wishlistData.length > 0 ? wishlistData[0].products : [];

    // Save to Cache (10 mins)
    await redisClient.setEx(cacheKey, 600, JSON.stringify({ success: true, data: products }));

    res.status(200).json({ success: true, data: products });

  } catch (error) {
    console.error("Wishlist Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. REMOVE FROM WISHLIST
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    await Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { products: productId } }
    );

    // Clear Cache
    await redisClient.del(`wishlist:user:${userId}`);

    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};