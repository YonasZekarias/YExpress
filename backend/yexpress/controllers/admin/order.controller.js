const Order = require('../../models/Order');
const logger = require('../../utils/logger');
const redisClient = require('../../config/redis');
const buildOrderQuery = require("../../utils/orderQueryBuilder");

const getAllOrder = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    
    // Ensure pipeline handles pagination logic or manual slice is needed
    const pipeline = buildOrderQuery(req.query, req.user); 
    const orders = await Order.aggregate(pipeline);

    // Manual Pagination Check
    let nextCursor = null;
    if (orders.length > limit) {
      nextCursor = orders[limit - 1]._id; // Assuming sorted by _id or createdAt
      orders.pop(); // Remove the extra item fetched to check for next page
    }

    res.status(200).json({
      success: true,
      nextCursor,
      results: orders.length,
      data: orders,
    });
  } catch (err) {
    logger.error("Get All Orders Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('user', 'name email')
            .populate('items.product', 'name photo')
            .populate('items.variant'); 

        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        logger.error("Get Order By ID Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getOrderByStatus = async (req, res) => {
    try {
        const status = req.params.status; // FIX: was req.params.body
        const orders = await Order.find({ orderStatus: status })
            .populate('user', 'name email')
            .populate('items.product', 'name');

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        logger.error("Get Order By Status Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.orderStatus = status;
    if (status === "delivered") order.deliveredAt = Date.now();

    await order.save();

    // Clear cache safely
    try {
        if (redisClient.isOpen) {
            await redisClient.del(`order:${id}`);
            await redisClient.del("orders:all");
        }
    } catch (redisErr) {
        logger.warn("Redis Error:", redisErr);
    }

    res.status(200).json({ success: true, message: "Order status updated", data: order });
  } catch (error) {
    logger.error("Update Order Status Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const orderStats = async (req, res) => {
  try {
    // FIX: Run queries in parallel
    const [
        totalOrders, 
        pending, 
        processing, 
        delivered, 
        cancelled
    ] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ orderStatus: "pending" }),
        Order.countDocuments({ orderStatus: "processing" }),
        Order.countDocuments({ orderStatus: "delivered" }),
        Order.countDocuments({ orderStatus: "cancelled" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pending,
        processing,
        delivered,
        cancelled,
      },
    });

  } catch (error) {
    logger.error("Order Stats Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
    getAllOrder,
    getOrderById,
    getOrderByStatus,
    updateOrderStatus,
    orderStats,
};