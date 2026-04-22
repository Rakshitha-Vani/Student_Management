const express = require("express");
const router = express.Router();

const controller = require("../controllers/student.controller");
const { validateStudent } = require("../middlewares/validation.middleware");
const { validateObjectId } = require("../middlewares/validateObjectId.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { upload } = require("../config/cloudinary");

/**
 * Student Routes
 *
 * MIDDLEWARE ORDER MATTERS:
 * 1. protect runs first → validates JWT token
 * 2. validateObjectId runs second → validates the :id param format
 * 3. validateStudent runs third → validates the request body
 * 4. controller method runs last → handles the actual logic
 *
 * WHY protect on all routes?
 * All student routes now require authentication.
 * Only logged-in users can create, read, update, or delete students.
 */

// All routes are protected - require valid JWT token
router.use(protect);

// POST   /api/students       → Create a new student (with optional image)
router.post("/", upload.single("profileImage"), validateStudent, controller.create);

// GET    /api/students       → Get all students (supports ?page=1&limit=10&search=john)
router.get("/", controller.getAll);

// GET    /api/students/:id   → Get a single student by ID
router.get("/:id", validateObjectId, controller.getOne);

// PUT    /api/students/:id   → Update a student by ID
router.put("/:id", validateObjectId, upload.single("profileImage"), validateStudent, controller.update);

// DELETE /api/students/:id   → Delete a student by ID
router.delete("/:id", validateObjectId, controller.remove);

module.exports = router;