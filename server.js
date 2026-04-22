/**
 * Server Entry Point
 *
 * WHY load config first?
 * config/index.js calls require("dotenv").config() which loads .env variables.
 * This MUST happen before anything else tries to use process.env values.
 *
 * WHY connect to DB before starting the server?
 * If the database connection fails, there's no point starting the HTTP server.
 * By awaiting connectDB(), we ensure MongoDB is ready before accepting requests.
 *
 * FLOW:
 * 1. Load environment variables (via config)
 * 2. Connect to MongoDB Atlas
 * 3. Start Express server
 * 4. If DB connection fails → process exits (handled in config/db.js)
 */
const http = require("http");
const { PORT } = require("./config");
const connectDB = require("./config/db");
const app = require("./app");
const socketUtil = require("./utils/socket");

const startServer = async () => {
  try {
    // Step 1: Connect to MongoDB
    await connectDB();

    // Step 2: Create HTTP server from Express app
    const server = http.createServer(app);

    // Step 3: Initialize WebSockets
    socketUtil.init(server);

    // Step 4: Start the server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api/students`);
      console.log(`🔌 WebSockets initialized`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();