const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const verifyRole = require("../middleware/verifyRole");

router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorById);
router.put("/modify/:id", doctorController.modifyDoctorById);

// Admin role related routes
router.get("/pending", verifyRole("admin"), doctorController.getPendingDoctors);
router.put(
  "/approve/:id",
  verifyRole("admin"),
  doctorController.approveDoctorById
);
router.put(
  "/reject/:id",
  verifyRole("admin"),
  doctorController.rejectDoctorById
);
router.delete(
  "/delete/:id",
  verifyRole("admin"),
  doctorController.deleteDoctorById
);

module.exports = router;
