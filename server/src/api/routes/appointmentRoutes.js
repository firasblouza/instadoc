const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const verifyRole = require("../middleware/verifyRole");

router.get("/:id", appointmentController.getAppointmentById);
router.get("/user/:id", appointmentController.getUserAppointments);
router.get("/doctor/:id", appointmentController.getDoctorAppointments);
router.put("/cancel/:id", appointmentController.cancelAppointment);
router.put("/modify/:id", appointmentController.modifyAppointmentById);
router.post("/", appointmentController.scheduleAppointment);

router.put("/message/:id", appointmentController.createMessage);
// Admin related routes
router.get("/", verifyRole("admin"), appointmentController.getAllAppointments);
router.delete(
  "/:id",

  appointmentController.deleteAppointmentById
);

module.exports = router;
