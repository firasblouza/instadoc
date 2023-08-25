const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const doctorController = require("../controllers/doctorController");
const verifyRole = require("../middleware/verifyRole");

router.delete(
  "/patient/:id",
  verifyRole("admin"),
  userController.deleteUserById
);
router.delete(
  "/doctor/:id",
  verifyRole("admin"),
  doctorController.deleteDoctorById
);

router.get("/statistics", adminController.fetchStatistics);
router.get("/patients", verifyRole("admin"), userController.getAllUsers);
router.get("/doctors", verifyRole("admin"), doctorController.getAllDoctors);
router.put("/patient/:id", verifyRole("admin"), userController.modifyUserById);

// Modify Doctor Route
router.put(
  "/doctor/:id",
  verifyRole("admin"),
  doctorController.modifyDoctorById
);
// Get Pending Doctors
router.get(
  "/doctors/pending",
  verifyRole("admin"),
  doctorController.getPendingDoctors
);

// Approve Doctor Route
router.put(
  "/doctor/approve/:id",
  verifyRole("admin"),
  doctorController.approveDoctorById
);

// Reject Doctor Route
router.put(
  "/doctor/reject/:id",
  verifyRole("admin"),
  doctorController.rejectDoctorById
);

// Delete Doctor Route
router.delete(
  "/doctor/:id",
  verifyRole("admin"),
  doctorController.deleteDoctorById
);

module.exports = router;
