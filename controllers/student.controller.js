const studentService = require("../services/student.service");

/**
 * Controller Layer — ONLY handles HTTP request/response.
 *
 * WHY async (req, res, next)?
 * Because our service methods are now async (they talk to MongoDB).
 * We use try/catch to forward any errors to the global error handler via next(err).
 *
 * WHY keep controllers thin?
 * - No business logic here — it all lives in the service layer
 * - Controllers ONLY extract data from req, call the service, and send the response
 * - This makes the code testable and reusable
 */

// ─── CREATE ───────────────────────────────────────────────
exports.create = async (req, res, next) => {
  try {
    const student = await studentService.createStudent(req.body);
    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET ALL ──────────────────────────────────────────────
exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await studentService.getAllStudents({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search: search || ""
    });
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET ONE ──────────────────────────────────────────────
exports.getOne = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    next(err);
  }
};

// ─── UPDATE ───────────────────────────────────────────────
exports.update = async (req, res, next) => {
  try {
    const student = await studentService.updateStudent(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student
    });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE ───────────────────────────────────────────────
exports.remove = async (req, res, next) => {
  try {
    const student = await studentService.deleteStudent(req.params.id);
    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: student
    });
  } catch (err) {
    next(err);
  }
};