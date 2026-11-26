require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

// Check environment variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error("Missing MONGO_URI or JWT_SECRET in .env");
    process.exit(1);
}

// Start Server
const startServer = async () => {
    try {
        // Connect Database
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log("--------------------------------");
            console.log("Backend Server Started");
            console.log(`Server: http://localhost:${PORT}`);
            console.log("--------------------------------");
        });

    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();