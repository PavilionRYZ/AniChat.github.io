const express = require('express');
const router = express.Router();
const { signup, login, logout, verifyOtp, forgotPassword, resetPassword, updateProfile, checkAuth } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

router.route('/signup').post(signup);
router.route('/verify-otp').post(verifyOtp);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);
router.route('/update-profile').put(verifyToken, updateProfile);
router.route('/check-auth').get(verifyToken, checkAuth);

module.exports = router;