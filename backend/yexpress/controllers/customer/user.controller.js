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
    const totalOrders = await Order.countDocuments({ userId: req.user._id });
    const pendingOrders = await Order.countDocuments({
      userId: req.user._id,
      status: "pending",
    });
    const wishList = await Wishlist.aggregate([
      { $match: { user: req.user._id } },
      { $project: { count: { $size: "$products" } } }
    ]);
    const wishListCount = wishList.length > 0 ? wishList[0].count : 0;
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
