const User = require("../../models/User");
const logger = require("../../utils/logger");
const Order = require("../../models/Order");
const Wishlist = require("../../models/Wishlist");
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const totalOrders = await Order.countDocuments({
      user: req.user._id,
    });

    const pendingOrders = await Order.countDocuments({
      user: req.user._id,
      orderStatus: "pending",
    });
const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

// Filter out any products that came back null (deleted from DB)
const validProducts = wishlist.products.filter(product => product !== null);

const wishListCount = validProducts.length;
    res.status(200).json({
      totalOrders,
      pendingOrders,
      wishListCount,
    });
  } catch (error) {
    logger.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    logger.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const editUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    logger.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  getUserProfile,
  editUserProfile,
  getUserStats,
};
