/**
 * Global Error Handler Middleware
 *
 * WHY a global error handler?
 * Instead of handling errors in every route/controller, we forward all errors
 * to this single middleware using next(err). This centralizes error formatting
 * and ensures consistent error responses across the entire API.
 *
 * MONGOOSE-SPECIFIC ERRORS:
 * Mongoose throws specific error types that we need to handle differently:
 *
 * 1. CastError — When an invalid ObjectId is passed (e.g., "abc123" instead of a valid 24-char hex)
 * 2. ValidationError — When schema validation fails (required fields missing, min/max violations)
 * 3. Error code 11000 — When a duplicate key is inserted (unique constraint violation)
 */
exports.errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ─── Handle Invalid MongoDB ObjectId ────────────────────
  // Example: GET /api/students/invalidid123
  // Mongoose throws a CastError because "invalidid123" is not a valid ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}. Please provide a valid ID.`;
  }

  // ─── Handle Mongoose Validation Errors ──────────────────
  // Example: POST /api/students with { name: "", age: -5 }
  // Mongoose throws a ValidationError with details for each invalid field
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = `Validation Error: ${errors.join(", ")}`;
  }

  // ─── Handle Duplicate Key Errors ────────────────────────
  // Example: If you add a unique index and try to insert a duplicate value
  // MongoDB throws an error with code 11000
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue).join(", ");
    message = `Duplicate value for field: ${field}. Please use a different value.`;
  }

  // ─── Send Error Response ────────────────────────────────
  res.status(statusCode).json({
    success: false,
    message,
    // Only show stack trace in development (never expose in production)
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};