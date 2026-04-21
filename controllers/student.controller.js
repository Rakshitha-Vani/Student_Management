const studentService = require("../services/student.service");

// CREATE
exports.create = (req, res, next) => {
  try {
    const student = studentService.createStudent(req.body);
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
};

// GET ALL
exports.getAll = (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = studentService.getAllStudents({
      page: Number(page),
      limit: Number(limit),
      search
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// GET ONE
exports.getOne = (req, res, next) => {
  try {
    const student = studentService.getStudentById(req.params.id);
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};

// UPDATE
exports.update = (req, res, next) => {
  try {
    const student = studentService.updateStudent(req.params.id, req.body);
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.remove = (req, res, next) => {
  try {
    const student = studentService.deleteStudent(req.params.id);
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};