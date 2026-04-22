const studentService = require("../services/student.service");
const socketUtil = require("../utils/socket");

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
  const MAX_RETRIES = 3;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const data = { ...req.body };
      
      // If an image was uploaded, store the Cloudinary URL or local path
      if (req.file) {
        data.profileImage = req.file.path;
        
        // If it's local storage, we need to normalize the path for the web
        if (!require("../config/cloudinary").isCloudinaryConfigured) {
          // data.profileImage will be something like "uploads/image.jpg"
          // We want it as "/uploads/image.jpg" so the browser can find it
          data.profileImage = `/${req.file.path.replace(/\\/g, '/')}`;
        }
      }

      const student = await studentService.createStudent(data);
      
      // Notify all clients in real-time
      socketUtil.emit("student:created", student);

      return res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: student
      });
    } catch (err) {
      attempts++;
      console.warn(`⚠️ Create student failed (attempt ${attempts}/${MAX_RETRIES}):`, err.message);
      if (attempts === MAX_RETRIES) return next(err);
      // Wait 500ms before retrying
      await new Promise(resolve => setTimeout(resolve, 500));
    }
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
    const data = { ...req.body };
    
      // If an image was uploaded, store the Cloudinary URL or local path
      if (req.file) {
        data.profileImage = req.file.path;
        
        // If it's local storage, we need to normalize the path for the web
        if (!require("../config/cloudinary").isCloudinaryConfigured) {
          // data.profileImage will be something like "uploads/image.jpg"
          // We want it as "/uploads/image.jpg" so the browser can find it
          data.profileImage = `/${req.file.path.replace(/\\/g, '/')}`;
        }
      }

    const student = await studentService.updateStudent(req.params.id, data);
    
    // Notify all clients in real-time
    socketUtil.emit("student:updated", student);

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
    
    // Notify all clients in real-time
    socketUtil.emit("student:deleted", student._id);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: student
    });
  } catch (err) {
    next(err);
  }
};