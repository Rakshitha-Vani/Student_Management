/**
 * Auth Middleware - Protect routes with JWT verification
 * 
 * WHAT DOES THIS DO?
 * This middleware runs before protected routes.
 * It verifies the JWT token sent by the client.
 * If valid, it adds user info to req.user so the route can use it.
 * If invalid, it returns 401 Unauthorized.
 * 
 * HOW IT WORKS:
 * 1. Get token from Authorization header
 * 2. Verify token using JWT_SECRET
 * 3. If valid, add user info to req.user
 * 4. If invalid, return error
 * 
 * HEADER FORMAT:
 * Authorization: Bearer <token>
 * 
 * WHY "BEARER"?
 * It's a standard prefix for JWT tokens. The format is:
 * "Bearer " + token
 * This helps distinguish JWT tokens from other auth methods.
 */

const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const User = require('../models/user.model');

exports.protect = async (req, res, next) => {
  try {
    // Step 1: Get token from header
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError(401, 'No token provided. Please log in.'));
    }

    // Step 2: Verify token
    // jwt.verify() checks:
    // - Token signature (is it signed with our secret?)
    // - Token expiry (has it expired?)
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret_change_in_production'
      );
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new ApiError(401, 'Token expired. Please log in again.'));
      }
      return next(new ApiError(401, 'Invalid token. Please log in again.'));
    }

    // Step 3: Get user from token
    // We decode the token to get userId, then fetch the user from DB
    // This ensures the user still exists and is active
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new ApiError(401, 'User no longer exists.'));
    }

    // Step 4: Add user to request
    // Now the route handler can access req.user
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Optional Auth - Attach user if token exists, but don't require it
 * 
 * Use this for routes that work both with and without authentication.
 * For example: Viewing public content vs private content.
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret_change_in_production'
      );
      
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = {
          userId: decoded.userId,
          email: decoded.email
        };
      }
    }

    next();
  } catch (err) {
    // Don't throw error for optional auth - just continue without user
    next();
  }
};