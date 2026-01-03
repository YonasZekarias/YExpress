const {protect} = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const {addAttribute,deleteAttribute,editAttribute,getAllAtributes} = require('../controllers/admin/attribute.controller')
const {addCategory, allCategories,deleteCategory,editCategory,getACategoryByID} = require('../controllers/admin/category.controller')
const {getAllOrder,getOrderById,getOrderByStatus,updateOrderStatus,orderStats} = require('../controllers/admin/order.controller')
const {addProduct,deleteAProduct,getAProductByID,getAllProducts,updateAProduct} = require('../controllers/admin/product.controller')
const {allUsers,banUnbanUser,getUserById} = require('../controllers/admin/users.controller')  
const router = require('express').Router();

router.use(protect, role('admin'));
// Attribute routes
router.post('/attributes', addAttribute);
router.get('/attributes', getAllAtributes);
router.put('/attributes/:attributeId', editAttribute);
router.delete('/attributes/:attributeId', deleteAttribute);

// Category routes
router.post('/categories', addCategory);
router.get('/categories', allCategories);
router.get('/categories/:categoryId', getACategoryByID);
router.put('/categories/:categoryId', editCategory);
router.delete('/categories/:categoryId', deleteCategory);

// Product routes
router.post('/products', addProduct);
router.get('/products', getAllProducts);
router.get('/products/:productId', getAProductByID);
router.put('/products/:productId', updateAProduct);
router.delete('/products/:productId', deleteAProduct);

// Order routes
router.get('/orders', getAllOrder);
router.get('/orders/status/:status', getOrderByStatus);
router.get('/orders/:orderId', getOrderById);
router.put('/orders/:orderId/status', updateOrderStatus);
router.get('/orders/stats', orderStats);

// User routes
router.get('/users', allUsers);
router.get('/users/:userId', getUserById);
router.put('/users/:userId/ban', banUnbanUser);

module.exports = router;