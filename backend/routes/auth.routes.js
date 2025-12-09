const {login,register, logout, verifyEmail, forgotPassword, refreshToken} = require('../controllers/auth/auth.controller')
const router = require('express').Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

module.exports = router;