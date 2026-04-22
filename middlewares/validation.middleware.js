const ApiError = require("../utils/apiError");

/**
 * Student Validation Middleware
 *
 * WHY validate BEFORE hitting the database?
 * - Mongoose has its own validation, but it happens at the DB layer
 * - Validating in middleware catches bad data EARLY (before it even reaches the service)
 * - This reduces unnecessary database calls and gives faster responses
 * - Think of it as a "gatekeeper" — only clean data passes through
 *
 * WHY keep both middleware validation AND Mongoose validation?
 * - Middleware validation: catches obvious errors quickly (missing fields, wrong types)
 * - Mongoose validation: catches schema-level constraints (min/max, unique, etc.)
 * - Defense in depth — two layers of protection
 */
exports.validateStudent = (req, res, next) => {
  const { name, age, course } = req.body;

  // Check for required fields
  if (!name || age === undefined || age === null || !course) {
    return next(new ApiError(400, "All fields (name, age, course) are required"));
  }

  // Validate name is a string
  if (typeof name !== "string" || name.trim().length === 0) {
    return next(new ApiError(400, "Name must be a non-empty string"));
  }

  // Validate age is a number and within range
  if (typeof age !== "number" || isNaN(age)) {
    return next(new ApiError(400, "Age must be a valid number"));
  }

  if (age < 5 || age > 100) {
    return next(new ApiError(400, "Age must be between 5 and 100"));
  }

  // Validate course is a string
  if (typeof course !== "string" || course.trim().length === 0) {
    return next(new ApiError(400, "Course must be a non-empty string"));
  }

  next();
};