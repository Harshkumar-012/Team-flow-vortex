const express = require("express");

const router = express.Router();

const {
    register,
    login,
    logout,
    getProfile
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Registration API
router.post("/register", register);

// Login API
router.post("/login", login);

// Logout API
router.post("/logout", authMiddleware, logout);

// Protected Profile API
router.get("/profile", authMiddleware, getProfile);

module.exports = router;