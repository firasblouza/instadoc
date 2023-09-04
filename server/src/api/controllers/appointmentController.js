const Appointment = require("../models/Appointment");
const jwt = require("jsonwebtoken");

const getAllAppointments = async (req, res) => {
  // Parameters for the pagination
  const page = parseInt(req.query.page);
  const limit = 10;
  const skip = (page - 1) * limit;
  try {
    const appointments = await Appointment.find({})
      .skip(skip)
      .limit(limit)
      .exec();
    if (appointments) {
      res.status(200).json(appointments);
    } else {
      res.status(404).json({ message: "No appointments found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while fetching appointments" });
  }
};

const getAppointmentById = async (req, res) => {
  const appointmentId = req.params.id;
  let id;
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (decoded) {
    id = decoded.UserInfo.id;
  }
  try {
    const appointment = await Appointment.findById(appointmentId).exec();
    if (appointment) {
      res.status(200).json(appointment);
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while fetching appointment" });
  }
};

const getDoctorAppointments = async (req, res) => {
  const doctorId = req.params.id;
  try {
    const appointments = await Appointment.find({ doctorId }).exec();
    if (appointments) {
      res.status(200).json(appointments);
    } else {
      res.status(404).json({ message: "No appointments found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while fetching appointments" });
  }
};

const getUserAppointments = async (req, res) => {
  const userId = req.params.id;
  try {
    const appointments = await Appointment.find({ userId }).exec();
    if (appointments) {
      res.status(200).json(appointments);
    } else {
      res.status(404).json({ message: "No appointments found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while fetching appointments" });
  }
};

const scheduleAppointment = async (req, res) => {
  const { userId, doctorId, reason, date, dateTime } = req.body;
  if (!userId || !doctorId || !reason || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const newAppointment = await Appointment.create({
      userId,
      doctorId,
      reason,
      date
    });
    console.log(newAppointment);
    res.status(201).json({ message: "Appointment created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error while creating appointment" });
  }
};

const cancelAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const cancelledAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "Cancelled" }
    ).exec();
    if (cancelledAppointment) {
      res.status(200).json({ message: "Appointment cancelled successfully" });
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while cancelling appointment" });
  }
};

const modifyAppointmentById = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: req.body },
      { new: true }
    ).exec();
    if (updatedAppointment) {
      res.status(200).json({ message: "Appointment updated successfully" });
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while updating appointment" });
  }
};

const deleteAppointmentById = async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      appointmentId
    ).exec();
    if (deletedAppointment) {
      res.status(200).json({ message: "Appointment deleted successfully" });
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while deleting appointment" });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  getDoctorAppointments,
  getUserAppointments,
  scheduleAppointment,
  modifyAppointmentById,
  cancelAppointment,
  deleteAppointmentById
};
