const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const doctorController = require("../controllers/doctorController");
const verifyRole = require("../middleware/verifyRole");

router.delete("/user/:id", verifyRole("admin"), userController.deleteUserById);
router.delete(
  "/doctor/:id",
  verifyRole("admin"),
  doctorController.deleteDoctorById
);
router.get("/users", verifyRole("admin"), userController.getAllUsers);
router.get("/doctors", verifyRole("admin"), doctorController.getAllDoctors);
router.put("/user/:id", verifyRole("admin"), userController.modifyUserById);
router.put(
  "/doctor/:id",
  verifyRole("admin"),
  doctorController.modifyDoctorById
);

module.exports = router;
