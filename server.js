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
const { PORT } = require("./config");
const connectDB = require("./config/db");
const app = require("./app");

const startServer = async () => {
  // Step 1: Connect to MongoDB (exits process if connection fails)
  await connectDB();

  // Step 2: Start the HTTP server only after DB is connected
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api/students`);
  });
};

startServer();