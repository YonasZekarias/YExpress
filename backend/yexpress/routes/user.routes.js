const protect = require('../middleware/auth.middleware')
const role = require('../middleware/role.middleware')  
const {getUserCart, clearUserCart, addToCart, editCartItemQuantity,removeCartItem} = require("../controllers/customer/cart.controller")
const {createOrder,getOrderById,orderStats, getMyOrders} = require('../controllers/customer/order.controller')
const {getAllCategories,getAllProduct,getProductById}=require('../controllers/customer/product.controller')
const {createReview} = require('../controllers/customer/review.controller')
const {getUserStats,getUserProfile, editUserProfile} = require('../controllers/customer/user.controller')
const {getWishlist,toggleWishlist}= require('../controllers/customer/wishlist.controller')
const router = require('express').Router();

router.use(protect,role('user'))
// Cart routes

router.get('/cart', getUserCart);
router.post('/cart', addToCart);
router.put('/cart/item/:itemId', editCartItemQuantity);
router.delete('/cart/item/:itemId', removeCartItem);
router.delete('/cart', clearUserCart);

// Order routes
router.post('/orders', createOrder);
router.get('/orders', getMyOrders);
router.get('/orders/stats', orderStats);
router.get('/orders/:orderId', getOrderById);

// Product routes
router.get('/products/categories', getAllCategories);
router.get('/products', getAllProduct);
router.get('/products/:id', getProductById);

// Review routes
router.post('/reviews', createReview);

// User routes
router.get('/user/profile', getUserProfile);
router.put('/user/profile', editUserProfile);
router.get('/user/stats', getUserStats);
//wishlist routes
router.post('/wishlist', toggleWishlist);
router.get('/wishlist', getWishlist);

module.exports = router;