const protect = require('../middleware/auth.middleware');
const {getUserProfile,editUserProfile} = require('../controllers/customer/user.controller');


const router = require('express').Router();

router.use(protect);

// User profile routes
router.get('/profile', getUserProfile);
router.put('/profile', editUserProfile);

module.exports = router;