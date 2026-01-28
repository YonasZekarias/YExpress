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
    try{
        const userId = req.user._id;
        const {productId, variantId, quantity} = req.body;
        const product = await Product.findByID(productId);
        const productVarinat = ProductVariant.findByID(variantId)
        if (!product) res.status(404).json({success : false, message : "Product Not Found"});
        const price =productVarinat.price;
        let cart = await Cart.findOne({user : userId});
        if (!cart) await Cart.create({user : userId, item : [], totalPrice : 0})
        const existingItem = Cart.items.find(
            item => item.product.toString() === productId && item.variant?.toString() === variantId
            )
        if (existingItem){
            existingItem.items.quantity +=quantity
        }else{
            cart.items.push({product : productId, variant : variantId,quantity, price})
        }

        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * quantity)

        await cart.save()
        res.status(201).json({success : true, data : cart})
    }catch(error){
        logger.error(error)
        res.status(500).json({success : false, message : error.message})
    }
}

const editCartItemQuantity = async(req , res) =>{
    try {
        const variantId = req.param.variantId;
        const {quantity} = req.body;
        const cart = Cart.findOne({user : req.user._id })
        if (!cart ) res.status(404).json({success :false, message : "cart not found"})
        
    } catch (error) {
        logger.error(error)
        res.status(500).json({success : false, message : error.message})
    }
}
module.exports = {
    getUserCart,
    clearUserCart,
    addToCart,
    editCartItemQuantity
}