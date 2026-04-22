const mongoose = require("mongoose");

/**
 * Student Schema
 *
 * WHY Mongoose Schema instead of a plain JS class?
 * - Mongoose schemas provide built-in validation (required, min, max, etc.)
 * - They auto-generate _id (MongoDB ObjectId) — no manual ID generation needed
 * - They support middleware (pre/post hooks) for advanced logic
 * - They enforce data structure at the application level
 *
 * FIELDS:
 * - name:      Student's full name (required, trimmed, 2-100 chars)
 * - age:       Student's age (required, must be between 5 and 100)
 * - course:    Course the student is enrolled in (required, trimmed)
 * - createdAt: Auto-generated timestamp when the record is created
 */
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [5, "Age must be at least 5"],
      max: [100, "Age cannot exceed 100"]
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
      minlength: [2, "Course must be at least 2 characters"],
      maxlength: [100, "Course name cannot exceed 100 characters"]
    },
    profileImage: {
      type: String,
      default: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" // Default placeholder
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * WHY timestamps: true?
 * Instead of manually setting createdAt with Date.now,
 * Mongoose's timestamps option automatically manages both
 * createdAt AND updatedAt fields. This is cleaner and less error-prone.
 */

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;