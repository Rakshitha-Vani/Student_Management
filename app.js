const express = require("express");
const cors = require("cors");
const app = express();

const path = require("path");
const studentRoutes = require("./routes/student.routes");
const authRoutes = require("./routes/auth.routes");
const { logger } = require("./middlewares/logger.middleware");
const  { errorHandler } = require("./middlewares/error.middleware");
const notFound = require("./middlewares/notFound.middleware");

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CORS - Allow all origins for development
app.use(cors({
  origin: '*'
}));

app.use(express.json());
app.use(logger);

// Public routes (no authentication required)
app.use("/api/auth", authRoutes);

// Protected routes (require authentication)
app.use("/api/students", studentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;