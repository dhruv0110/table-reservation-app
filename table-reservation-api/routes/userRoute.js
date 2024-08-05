const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createUser, loginUser, getUser, forgotPassword, verifyOtp, resetPassword } = require('../controllers/userController');
const fetchUser = require('../middleware/fetchUser');

// Create a User
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 5 }),
    body("contact", "Enter a valid contact number").optional().isLength({ min: 10 }),
  ],
  createUser
);

// Authenticate a User
router.post("/login", [
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password Cannot be blank").exists()
], loginUser);

// Get User Details
router.post('/getuser', fetchUser, getUser);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Verify OTP
router.post('/verify-otp', verifyOtp);

// Reset Password
router.post('/reset-password', resetPassword);

module.exports = router;
