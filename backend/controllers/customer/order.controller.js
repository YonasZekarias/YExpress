import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import redisClient from "../../utils/redisClinet.js";
import logger from "../../utils/logger.js";


export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const { shippingAddress, paymentMethod } = req.body;


    const order = await Order.create({
      user: userId,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress,
      paymentInfo: { method: paymentMethod, status: "pending" },
      totalAmount: cart.totalPrice
    });


    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();


    await redisClient.del(`orders:${userId}`);

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `orders:${userId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json({ cached: true, data: JSON.parse(cached) });
    }

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    await redisClient.set(cacheKey, JSON.stringify(orders), { EX: 60 * 5 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus !== "pending")
      return res.status(400).json({ message: "Order cannot be cancelled" });

    order.orderStatus = "cancelled";
    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: error.message });
  }
};
