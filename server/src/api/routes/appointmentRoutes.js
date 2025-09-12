const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const verifyRole = require("../middleware/verifyRole");
const verifyJWT = require("../middleware/verifyJWT");
const upload = require("../middleware/multer");

router.use(verifyJWT);

router
  .route("/")
  .get(appointmentController.getAllAppointments)
  .post(appointmentController.scheduleAppointment);

router.post('/message/:id/upload', upload.single('chatFile'), appointmentController.uploadChatFile);

router.get("/user/:id", appointmentController.getUserAppointments);
router.get("/doctor/:id", appointmentController.getDoctorAppointments);
router.put("/cancel/:id", appointmentController.cancelAppointment);
router.put("/reject/:id", appointmentController.rejectAppointment);
router.put("/modify/:id", appointmentController.modifyAppointmentById);
router.put("/message/:id", appointmentController.createMessage);

router
  .route("/:id")
  .get(appointmentController.getAppointmentById)
  .put(appointmentController.cancelAppointment)
  .delete(appointmentController.deleteAppointmentById);

module.exports = router;
