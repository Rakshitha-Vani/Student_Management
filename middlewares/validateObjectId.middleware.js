const mongoose = require("mongoose");
const ApiError = require("../utils/apiError");

/**
 * Validate MongoDB ObjectId Middleware
 *
 * WHY validate ObjectId before hitting the database?
 * - If you pass an invalid ID to Mongoose (e.g., "abc"), it throws a CastError
 * - While our error handler catches CastErrors, it's better to catch them EARLY
 * - This prevents unnecessary database queries with invalid IDs
 * - It gives the client a clear, immediate error message
 *
 * HOW does mongoose.Types.ObjectId.isValid() work?
 * It checks if the string is a valid 24-character hexadecimal string
 * that can be converted to a MongoDB ObjectId.
 *
 * USAGE: Add this middleware to any route that accepts :id param
 *   router.get("/:id", validateObjectId, controller.getOne);
 */
exports.validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ApiError(400, "Invalid student ID format"));
  }
  next();
};
