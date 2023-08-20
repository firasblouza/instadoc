const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const verifyRole = require("../middleware/verifyRole");

router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorById);
router.put("/modify/:id", doctorController.modifyDoctorById);

// Admin role related routes

module.exports = router;
