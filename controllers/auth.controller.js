/**
 * Auth Controller - Handle authentication logic
 * 
 * WHAT IS JWT (JSON WEB TOKEN)?
 * JWT is a compact, URL-safe token format for securely transmitting claims between parties.
 * It's like an ID card - it contains information about the user and is verified by a signature.
 * 
 * JWT STRUCTURE (3 parts separated by dots):
 * 1. Header - Contains algorithm and token type
 * 2. Payload - Contains the claims (data we want to store)
 * 3. Signature - Verifies the token hasn't been tampered with
 * 
 * Example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 * 
 * WHY USE JWT?
 * - Stateless - Server doesn't need to store sessions
 * - Scalable - Works across multiple servers
 * - Secure - Signature prevents tampering
 * - Contains user info - No need to query database for every request
 */

const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');

/**
 * Generate JWT Token
 * 
 * WHAT GOES IN THE TOKEN?
 * - userId: For identifying the user in future requests
 * - email: For display purposes
 * 
 * SECRET KEY:
 * - Stored in .env as JWT_SECRET
 * - Used to sign the token - anyone with the secret can verify it's valid
 * - NEVER expose this to the frontend!
 * 
 * EXPIRY:
 * - '7d' means token expires after 7 days
 * - After expiry, user must log in again (security feature)
 * - You can also use '1h' for 1 hour, '30m' for 30 minutes
 */
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'fallback_secret_change_in_production',
    { expiresIn: '7d' }
  );
};

/**
 * SIGNUP - Create new user account
 * 
 * FLOW:
 * 1. Validate request body (name, email, password)
 * 2. Check if user already exists (email must be unique)
 * 3. Create new user (password gets hashed automatically by pre-save middleware)
 * 4. Generate JWT token
 * 5. Return user data and token
 */
exports.signup = async (req, res, next) => {
  try {
    try {
      const { name, email, password } = req.body;
      console.log('SIGNUP: Received data:', { name, email, hasPassword: !!password });

      // Check if user already exists
      let existingUser;
      try {
        existingUser = await User.findOne({ email });
      } catch (dbErr) {
        console.error('SIGNUP: Database error during findOne:', dbErr.message);
        return next(new ApiError(500, 'Database error: ' + dbErr.message));
      }
      
      if (existingUser) {
        console.log('SIGNUP: User already exists');
        return next(new ApiError(400, 'Email already registered'));
      }

      // Create new user (password will be hashed by pre-save middleware)
      let user;
      try {
        user = await User.create({ name, email, password });
      } catch (createErr) {
        console.error('SIGNUP: Database error during create:', createErr.message);
        return next(new ApiError(500, 'Failed to create user: ' + createErr.message));
      }

      console.log('SIGNUP: User created:', user._id);

      // Generate token
      let token;
      try {
        token = generateToken(user._id, user.email);
      } catch (tokenErr) {
        console.error('SIGNUP: Token generation error:', tokenErr.message);
        return next(new ApiError(500, 'Token generation failed: ' + tokenErr.message));
      }

      // Return user data (toJSON removes password) and token
      console.log('SIGNUP: Sending success response');
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user.toJSON(),
        token
      });
    } catch (err) {
      console.error('SIGNUP: Unexpected error in catch block:', err);
      next(err);
    }
  } catch (err) {
    console.error('SIGNUP: Outer catch block error:', err);
    next(err);
  }
};

/**
 * LOGIN - Authenticate user
 * 
 * FLOW:
 * 1. Validate request body (email, password)
 * 2. Find user by email
 * 3. Compare password using bcrypt
 * 4. Generate JWT token
 * 5. Return user data and token
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(new ApiError(400, 'Please provide email and password'));
    }

    // Find user and include password (normally excluded)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    // Generate token
    const token = generateToken(user._id, user.email);

    // Return user data and token
    res.json({
      success: true,
      message: 'Login successful',
      data: user.toJSON(),
      token
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET CURRENT USER - Get logged in user info
 * 
 * This endpoint is protected - only accessible with valid JWT.
 * The auth middleware adds 'user' to req, so we just return it.
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    res.json({
      success: true,
      data: user.toJSON()
    });
  } catch (err) {
    next(err);
  }
};