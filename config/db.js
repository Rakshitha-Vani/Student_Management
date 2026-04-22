const mongoose = require("mongoose");

/**
 * connectDB - Establishes connection to MongoDB Atlas
 *
 * WHY async/await?
 * mongoose.connect() returns a promise. Using async/await lets us
 * handle success and failure cleanly without callback hell.
 *
 * WHY process.exit(1)?
 * If the database connection fails, the server cannot function.
 * Exiting immediately prevents the app from running in a broken state.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};

module.exports = connectDB;
