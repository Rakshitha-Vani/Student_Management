const express = require("express");
const router = express.Router();

const controller = require("../controllers/student.controller");
const { validateStudent } = require("../middlewares/validation.middleware");

router.post("/", validateStudent, controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.put("/:id", validateStudent, controller.update);
router.delete("/:id", controller.remove);

module.exports = router;