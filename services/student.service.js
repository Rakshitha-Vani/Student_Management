const Student = require("../models/student.model");
const ApiError = require("../utils/apiError");

/**
 * Service Layer — Contains ALL business logic and database interaction.
 *
 * WHY a separate service layer?
 * - Controllers should ONLY handle HTTP request/response
 * - Services are reusable (can be called from controllers, scripts, tests, etc.)
 * - Makes unit testing easier — you can test business logic without HTTP
 * - Follows the Single Responsibility Principle (SRP)
 *
 * WHY async/await everywhere?
 * Every Mongoose method (.create, .find, .findById, etc.) returns a Promise.
 * Using async/await makes the code readable and avoids callback hell.
 */

// ─── CREATE ───────────────────────────────────────────────
/**
 * Creates a new student in MongoDB.
 *
 * Student.create(data) is shorthand for:
 *   const student = new Student(data);
 *   await student.save();
 *
 * Mongoose will validate the data against our schema before saving.
 * If validation fails, it throws a ValidationError (caught by error middleware).
 */
exports.createStudent = async (data) => {
  const student = await Student.create(data);
  return student;
};

// ─── GET ALL (with pagination + search) ───────────────────
/**
 * Retrieves students with optional pagination and search.
 *
 * PAGINATION:
 *   - page: which page to return (default: 1)
 *   - limit: how many records per page (default: 10)
 *   - skip = (page - 1) * limit → tells MongoDB how many records to skip
 *
 * SEARCH:
 *   - Uses MongoDB $regex for partial name matching
 *   - "i" flag makes it case-insensitive
 *   - Example: search="john" matches "John", "JOHN", "johnny"
 *
 * WHY countDocuments()?
 *   We need the total count for the frontend to calculate total pages.
 *   countDocuments(filter) only counts documents matching our filter.
 *
 * WHY .sort({ createdAt: -1 })?
 *   Returns newest students first — better UX.
 */
exports.getAllStudents = async ({ page = 1, limit = 10, search = "" }) => {
  // Build filter object for search
  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: "i" }; // case-insensitive partial match
  }

  // Calculate how many documents to skip
  const skip = (page - 1) * limit;

  // Execute query with pagination
  const [students, total] = await Promise.all([
    Student.find(filter)
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit),
    Student.countDocuments(filter)
  ]);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: students
  };
};

// ─── GET BY ID ────────────────────────────────────────────
/**
 * Finds a single student by their MongoDB ObjectId.
 *
 * WHY throw ApiError instead of returning null?
 * If findById returns null, it means the ID is valid but no student exists.
 * We throw a 404 so the controller doesn't have to check for null.
 */
exports.getStudentById = async (id) => {
  const student = await Student.findById(id);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }
  return student;
};

// ─── UPDATE ───────────────────────────────────────────────
/**
 * Updates a student by ID and returns the updated document.
 *
 * OPTIONS:
 *   - new: true → returns the document AFTER the update (default returns the old one)
 *   - runValidators: true → re-runs schema validations on the updated fields
 *     (by default, findByIdAndUpdate SKIPS validation — this is a common gotcha!)
 */
exports.updateStudent = async (id, data) => {
  const student = await Student.findByIdAndUpdate(id, data, {
    new: true,           // return updated document
    runValidators: true  // validate updated fields against schema
  });

  if (!student) {
    throw new ApiError(404, "Student not found");
  }
  return student;
};

// ─── DELETE ───────────────────────────────────────────────
/**
 * Deletes a student by ID and returns the deleted document.
 *
 * WHY return the deleted document?
 * Returning it allows the client to confirm which record was removed.
 * This is a common REST API pattern.
 */
exports.deleteStudent = async (id) => {
  const student = await Student.findByIdAndDelete(id);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }
  return student;
};