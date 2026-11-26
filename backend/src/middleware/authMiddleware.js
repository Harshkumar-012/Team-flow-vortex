const jwt = require("jsonwebtoken");

const User = require("../models/User");
const TokenBlacklist = require("../models/TokenBlacklist");

const authMiddleware = async (req, res, next) => {
    try {
        // Check authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Token required"
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Check token blacklist
        const blacklistedToken = await TokenBlacklist.findOne({
            token
        });

        if (blacklistedToken) {
            return res.status(401).json({
                success: false,
                message: "Token has been logged out"
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find user
        const user = await User.findById(decoded.id)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Attach user and token to request
        req.user = user;
        req.token = token;
        req.tokenPayload = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;