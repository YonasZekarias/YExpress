const Order = require('../../models/Order')
const logger = require('../../utils/logger')
const redisClient = require('../../utils/redisClinet')

const getAllOrder = async (req, res) =>{
    try {
        const allOrders = await Order.find()
        res.status(200).json(allOrders)
    } catch (error) {
        logger.error({error : "error fetching orders", error})
        res.status(500).json("error fetching orders")
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
module.exports ={
    getAllOrder,
    getOrderById,
    getOrderByStatus,
    updateOrderStatus,
} 