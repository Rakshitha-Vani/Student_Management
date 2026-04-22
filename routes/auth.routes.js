/**
 * Auth Routes - Authentication endpoints
 * 
 * ROUTES:
 * POST /api/auth/signup - Register new user
 * POST /api/auth/login - Login user
 * GET /api/auth/me - Get current user (protected)
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

// POST /api/auth/signup - Public (no auth required)
router.post('/signup', authController.signup);

// POST /api/auth/login - Public (no auth required)
router.post('/login', authController.login);

// GET /api/auth/me - Protected (requires valid JWT)
router.get('/me', protect, authController.getMe);

module.exports = router;