const Cart = require('../../models/Cart')
const Product = require('../../models/Product')
const ProductVariant = require('../../models/productVariant')
const logger = require('../../utils/logger')

const getUserCart = async (req, res) => {
    try {;
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product').populate('items.variant');
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        logger.error({ error: "Error fetching cart by user ID", details: error });
        res.status(500).json({ success: false, message: error.message });
    }
};
const clearUserCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }
        res.status(200).json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
        logger.error({ error: "Error clearing cart by user ID", details: error });
        res.status(500).json({ success: false, message: error.message });
    }
};
const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, variantId, quantity } = req.body;

        // 1. Validation
        if (!productId || quantity < 1) {
            return res.status(400).json({ success: false, message: "Invalid product or quantity" });
        }

        // 2. Fetch Product & Variant
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product Not Found" });
        }

        let price = product.price; // Default to base product price
        let variant = null;

        if (variantId) {
            variant = await ProductVariant.findById(variantId);
            if (!variant) {
                return res.status(404).json({ success: false, message: "Variant Not Found" });
            }
            price = variant.price; // Override with variant price
        }

        // 3. Find or Create Cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalPrice: 0 });
        }

        // 4. Update Items
        // Check if this exact product+variant combo exists
        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId && 
            (item.variant ? item.variant.toString() === variantId : variantId === null)
        );

        if (itemIndex > -1) {
            // Update existing item quantity
            cart.items[itemIndex].quantity += quantity;
            // Optional: Update price if it changed in the DB since last add
            cart.items[itemIndex].price = price; 
        } else {
            // Push new item
            cart.items.push({
                product: productId,
                variant: variantId || null,
                quantity: quantity,
                price: price
            });
        }

        // 5. Recalculate Total Price
        // Use item.quantity (total in cart) * item.price
        cart.totalPrice = cart.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        await cart.save();
        
        // Populate for frontend response
        await cart.populate(['items.product', 'items.variant']);

        res.status(200).json({ success: true, data: cart });

    } catch (error) {
        logger.error("Add to cart error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const editCartItemQuantity = async(req, res) => {
    try {
        // req.params usually holds the ID in the URL (e.g., /cart/:itemId)
        // Using item's unique _id is safer than variantId for editing
        const { itemId } = req.params; 
        const { quantity } = req.body;

        if (quantity < 1) {
             return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        const item = cart.items.id(itemId); // Mongoose helper to find subdocument
        if (!item) return res.status(404).json({ success: false, message: "Item not found in cart" });

        item.quantity = quantity;

        // Recalculate Total
        cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await cart.save();
        res.status(200).json({ success: true, data: cart });
        
    } catch (error) {
        logger.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
// Add this to cart.controller.js
const removeCartItem = async (req, res) => {
    try {
        const { itemId } = req.params; // The _id of the item inside the cart array
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        // Filter out the item
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);

        // Recalculate Total
        cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await cart.save();
        res.status(200).json({ success: true, message: "Item removed", data: cart });

    } catch (error) {
        logger.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getUserCart,
    clearUserCart,
    addToCart,
    editCartItemQuantity,
    removeCartItem
}