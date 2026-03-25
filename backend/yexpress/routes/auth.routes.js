const {login,register, logout, verifyEmail, forgotPassword, refreshToken} = require('../controllers/auth/auth.controller')
const { authLimiter } = require('../middleware/rateLimit.middleware');
const router = require('express').Router();

router.post('/register', authLimiter, register);
router.post('/verify-email', authLimiter, verifyEmail);
router.post('/login', authLimiter, login);
router.get('/refresh-token', refreshToken);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/logout', logout);

module.exports = router;