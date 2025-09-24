const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const doctorController = require("../controllers/doctorController");
const verifyRole = require("../middleware/verifyRole");
const upload = require("../middleware/multer");

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
router.put("/patient/:id", upload.fields([{ name: "profileImage" }]), verifyRole("admin"), userController.modifyUserById);

// Modify Doctor Route
router.put(
  "/doctor/:id",
  upload.fields([
    { name: "profileImage" },
    { name: "cvImage" },
    { name: "idImage" },
    { name: "licenseImage" }
  ]),
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
