const protect = require('../middleware/auth.middleware')
const role = require('../middleware/role.middleware')  
const {getUserCart, clearUserCart, addToCart, editCartItemQuantity,} = require("../controllers/customer/cart.controller")
const {createOrder, getUserOrders,getOrderById,cancelOrder,orderStats} = require('../controllers/customer/order.controller')
const {getAllCategories,getAllProduct,getProductById}=require('../controllers/customer/product.controller')
const {createReview} = require('../controllers/customer/review.controller')
const {getUserStats,getUserProfile, editUserProfile} = require('../controllers/customer/user.controller')
const {getWishlist,toggleWishlist}= require('../controllers/customer/wishlist.controller')
const router = require('express').Router();

// Cart routes
router.use(protect,role('user'))

router.get('/cart', getUserCart);
router.post('/cart', addToCart);
router.put('/cart/item/:itemId', editCartItemQuantity);
router.delete('/cart', clearUserCart);

// Order routes
router.post('/orders', createOrder);
router.get('/orders', getUserOrders);
router.get('/orders/:orderId', getOrderById);
router.put('/orders/:orderId/cancel', cancelOrder);
router.get('/orders/stats', orderStats);

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