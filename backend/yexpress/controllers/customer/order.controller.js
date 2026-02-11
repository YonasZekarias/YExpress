const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const ProductVariant = require('../../models/productVariant');
const logger = require('../../utils/logger'); 


const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const userId = req.user._id;

        // 1. Fetch User's Cart
        const cart = await Cart.findOne({ user: userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Your cart is empty" });
        }
        const orderItems = [];
        let totalAmount = 0;

        for (const item of cart.items) {
            let product, variant;
            let currentStock = 0;
            let priceToUse = item.price; // Default to cart price

            // Check if it's a variant or base product
            if (item.variant) {
                variant = await ProductVariant.findById(item.variant);
                if (!variant) {
                    return res.status(404).json({ success: false, message: `Variant for product ${item.product} not found` });
                }
                currentStock = variant.stock;
                priceToUse = variant.price; // Optional: Refresh price from DB
            } else {
                product = await Product.findById(item.product);
                if (!product) {
                    return res.status(404).json({ success: false, message: `Product not found` });
                }
                currentStock = product.stock;
                priceToUse = product.price; // Optional: Refresh price from DB
            }

            // The Critical Check
            if (currentStock < item.quantity) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Out of stock: "${product?.name || 'Item'}" only has ${currentStock} left.` 
                });
            }

            // Prepare item for the Order Model
            orderItems.push({
                product: item.product,
                variant: item.variant || null,
                quantity: item.quantity,
                price: priceToUse
            });

            totalAmount += (priceToUse * item.quantity);
        }

        // --- 3. STOCK DEDUCTION PHASE ---
        // Since validation passed, we now decrement the stock.
        for (const item of orderItems) {
            if (item.variant) {
                await ProductVariant.findByIdAndUpdate(item.variant, { 
                    $inc: { stock: -item.quantity } 
                });
            } else {
                await Product.findByIdAndUpdate(item.product, { 
                    $inc: { stock: -item.quantity } 
                });
            }
        }

        // --- 4. CREATE ORDER ---
        const order = new Order({
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentInfo: {
                method: paymentMethod, 
                status: 'pending', // Usually pending until webhook confirms or COD
            },
            totalAmount,
            orderStatus: "pending"
        });

        const createdOrder = await order.save();

        // --- 5. CLEAR CART ---
        await Cart.findOneAndDelete({ user: userId });

        res.status(201).json({ 
            success: true, 
            message: "Order placed successfully",
            data: createdOrder 
        });

    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const { status, sort } = req.query;

        // 1. Base Query: Always filter by the current user
        let query = { user: req.user._id };

        // 2. Add Status Filter (if provided and not 'all')
        if (status && status !== 'all') {
            query.orderStatus = status;
        }

        // 3. Define Sorting Logic
        let sortOptions = { createdAt: -1 }; // Default: Newest first

        if (sort === 'oldest') {
            sortOptions = { createdAt: 1 };
        } else if (sort === 'price_high') {
            sortOptions = { totalAmount: -1 };
        } else if (sort === 'price_low') {
            sortOptions = { totalAmount: 1 };
        }

        // 4. Execute Query
        const orders = await Order.find(query)
            .sort(sortOptions)
            .populate('items.product', 'name photo')
            .populate({
                path: 'items.variant',
                select: 'attributes',
                populate: { path: 'attributes.attribute', select: 'name' } // Adjust based on your schema
            });

        res.status(200).json({ 
            success: true, 
            count: orders.length, 
            data: orders 
        });

    } catch (error) {
        console.error("Get My Orders Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ 
            _id: req.params.id, 
            user: req.user._id 
        })
        .populate('items.product', 'name photo price')
        .populate({
            path: 'items.variant',
            populate: [
                { path: 'attributes.attribute', select: 'name' },
                { path: 'attributes.value', select: 'value' }
            ]
        });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error("Get Order By ID Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const orderStats = async (req, res) => {
  try {
    const userId = req.user._id; 

    
    const [
      pendingOrderCount, 
      processingOrderCount, 
      shippedOrderCount, 
      deliveredOrderCount, 
      cancelledOrderCount
    ] = await Promise.all([
      Order.countDocuments({ user: userId, orderStatus: "pending" }),
      Order.countDocuments({ user: userId, orderStatus: "processing" }),
      Order.countDocuments({ user: userId, orderStatus: "shipped" }),
      Order.countDocuments({ user: userId, orderStatus: "delivered" }),
      Order.countDocuments({ user: userId, orderStatus: "cancelled" }),
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        pending: pendingOrderCount,
        processing: processingOrderCount,
        shipped: shippedOrderCount,
        delivered: deliveredOrderCount,
        cancelled: cancelledOrderCount,
      },
    });
  } catch (error) {
    // logger.error(error); // Uncomment if you have a logger
    console.error("Order Stats Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    orderStats
};