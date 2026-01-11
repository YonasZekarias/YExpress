const Order = require('../../models/Order')
const Cart = require('../../models/Cart')
const logger = require('../../utils/logger')
const redisClient = require('../../utils/redisClinet')
const buildOrderQuery = require("../../utils/orderQueryBuilder");

const getAllOrder = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const pipeline = buildOrderQuery(req.query, req.user);

    const orders = await Order.aggregate(pipeline);

    let nextCursor = null;
    if (orders.length > limit) {
      nextCursor = orders[limit - 1]._id;
      orders.pop();
    }

    res.status(200).json({
      nextCursor,
      results: orders.length,
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const getOrderById = async (req, res) =>{
    try {
        const orderID = req.params.id
        const order = await Order.findById(orderID).populate('user').populate('items.product').populate('items.variant')
        if(!order){
            return res.status(404).json({success: false, message: "Order not found"})
        }
        res.status(200).json({success: true, data: order})
    } catch (error) {
      res.status(500).json({success: false, message: error.message})
      logger.error({error: "Error fetching order by ID", details: error})  
    }
};
const getOrderByStatus = async (req, res) =>{
    try {
        const status = req.params.body;
        const orders = await Order.find({orderStatus: status}).populate('user').populate('items.product').populate('items.variant')
        res.status(200).json({success: true, data: orders})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
        logger.error({error: "Error fetching orders by status", details: error})  
    }
};
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order || order.deleted) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = status;

    if (status === "delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save();

    // Clear cache
    await redisClient.del(`order:${id}`);
    await redisClient.del("orders:all");

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    logger.error("Error updating order", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const orderStats= async(req, res)=>{
  try {
    const totalOrders = await Order.countDocuments();
    const wishlistCount = await Cart.countDocuments()
    const pendingOrderCount = await Order.countDocuments({ orderStatus: "pending" });
    const processingOrderCount = await Order.countDocuments({ orderStatus: "processing" });
    const deliveredOrderCount = await Order.countDocuments({ orderStatus: "delivered" });
    const cancelledOrderCount = await Order.countDocuments({ orderStatus: "cancelled" });

    res.status(200).json({
      success: true,
      data: {
        totalOrders: totalOrders,
        wishlistCount: wishlistCount,
        pending:  pendingOrderCount,
        processing:  processingOrderCount,
        delivered:  deliveredOrderCount,
        cancelled:  cancelledOrderCount,
      },
    });

  } catch (error) {
    logger.error("error",error)
    res.status(500).json({success :false, message : error.message })
  }
}
module.exports ={
    getAllOrder,
    getOrderById,
    getOrderByStatus,
    updateOrderStatus,
    orderStats,
} 