const ApiError = require("../utils/apiError");

exports.validateStudent = (req, res, next) => {
  const { name, age, course } = req.body;

  if (!name || !age || !course) {
    return next(new ApiError(400, "All fields are required"));
  }

  if (isNaN(age)) {
    return next(new ApiError(400, "Age must be a number"));
  }

  next();
};