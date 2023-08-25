const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const upload = require("../middleware/multer");
const verifyJWT = require("../middleware/verifyJWT");

router.get("/", doctorController.getAllDoctors);
router.get("/statistics/:id", doctorController.fetchStatistics);
router.get("/:id", doctorController.getDoctorById);
router.put(
  "/:id",
  upload.fields([{ name: "profileImage", name: "cvImage" }]),
  doctorController.modifyDoctorById
);
router.delete("/:id", doctorController.deleteDoctorById);

router.put(
  "/password/:id",
  verifyJWT,
  doctorController.modifyDoctorPasswordById
);

// Admin role related routes

module.exports = router;
