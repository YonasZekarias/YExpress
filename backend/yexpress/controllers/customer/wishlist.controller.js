const mongoose = require("mongoose");
const Wishlist = require("../../models/Wishlist");
const { redisClient } = require("../../config/redis");

// 1. TOGGLE WISHLIST (Add if missing, Remove if present)
// This supports the single "Heart" button on your ProductCard
exports.toggleWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    const wishlist = await Wishlist.findOne({ user: userId });

    // Check if product is already in wishlist
    // Note: wishlist.products is an array of ObjectIds
    const exists = wishlist && wishlist.products.some(id => id.toString() === productId);

    if (exists) {
      // REMOVE
      await Wishlist.findOneAndUpdate(
        { user: userId },
        { $pull: { products: productId } }
      );
      // Clear cache
      await redisClient.del(`wishlist:user:${userId}`);
      return res.status(200).json({ success: true, message: "Removed from wishlist", action: 'removed' });
    } else {
      // ADD
      await Wishlist.findOneAndUpdate(
        { user: userId },
        { $addToSet: { products: productId } },
        { new: true, upsert: true } // Create if doesn't exist
      );
      // Clear cache
      await redisClient.del(`wishlist:user:${userId}`);
      return res.status(200).json({ success: true, message: "Added to wishlist", action: 'added' });
    }

  } catch (error) {
    console.error("Wishlist Toggle Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET WISHLIST (Updated to include Category & Stock for ProductCard)
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const cacheKey = `wishlist:user:${userId}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const wishlistData = await Wishlist.aggregate([
      { $match: { user: userId } },
      
      // Lookup Products
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "productObjects"
        }
      },
      { $unwind: "$productObjects" },
      { $match: { "productObjects.deleted": false } },

      // --- NEW: Lookup Category (Needed for ProductCard badge) ---
      {
        $lookup: {
          from: "categories",
          localField: "productObjects.category",
          foreignField: "_id",
          as: "productObjects.category" // Populate directly into the object
        }
      },
      { 
        $unwind: { 
          path: "$productObjects.category", 
          preserveNullAndEmptyArrays: true 
        } 
      },

      // Lookup Variants (For Price)
      {
        $lookup: {
          from: "productvariants",
          localField: "productObjects._id",
          foreignField: "product",
          as: "variants"
        }
      },

      // Calculate Price & Photo
      {
        $addFields: {
          "productObjects.price": { $ifNull: [{ $min: "$variants.price" }, 0] },
          "productObjects.displayPhoto": {
             $ifNull: [
               { $arrayElemAt: ["$productObjects.photo", 0] }, 
               { $arrayElemAt: ["$variants.photo", 0] }
             ]
          }
        }
      },

      // Group back
      {
        $group: {
          _id: "$_id",
          products: { $push: "$productObjects" }
        }
      },

      // Project: include ALL fields ProductCard needs
      {
        $project: {
          _id: 0,
          products: {
            _id: 1,
            name: 1,
            price: 1,
            photo: 1, // Keep array for ProductCard
            displayPhoto: 1, 
            slug: 1,
            averageRating: 1,
            ratingsCount: 1, // Needed
            stock: 1,        // Needed
            createdAt: 1,    // Needed for "New" badge
            category: { name: 1 } // Needed for badge
          }
        }
      }
    ]);

    const products = wishlistData.length > 0 ? wishlistData[0].products : [];

    await redisClient.setEx(cacheKey, 600, JSON.stringify({ success: true, data: products }));
    res.status(200).json({ success: true, data: products });

  } catch (error) {
    console.error("Wishlist Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};