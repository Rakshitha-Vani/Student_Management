const Student = require("../models/student.model");
const { generateId } = require("../utils/generateID");
const ApiError = require("../utils/apiError");

let students = []; // in-memory storage

// CREATE
exports.createStudent = (data) => {
  const student = new Student({
    id: generateId(),
    ...data
  });

  students.push(student);
  return student;
};

// GET ALL (with pagination + search)
exports.getAllStudents = ({ page = 1, limit = 5, search = "" }) => {
  let filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    total: filtered.length,
    data: filtered.slice(start, end)
  };
};

// GET BY ID
exports.getStudentById = (id) => {
  const student = students.find(s => s.id === id);
  if (!student) throw new ApiError(404, "Student not found");
  return student;
};

// UPDATE
exports.updateStudent = (id, data) => {
  const student = students.find(s => s.id === id);
  if (!student) throw new ApiError(404, "Student not found");

  Object.assign(student, data);
  return student;
};

// DELETE
exports.deleteStudent = (id) => {
  const index = students.findIndex(s => s.id === id);
  if (index === -1) throw new ApiError(404, "Student not found");

  return students.splice(index, 1)[0];
};