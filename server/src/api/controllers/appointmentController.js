const Appointment = require("../models/Appointment");

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
  const { userId, doctorId, reason, date, duration, type } = req.body;
  if (!userId || !doctorId || !reason || !date || !duration || !type) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const newAppointment = await Appointment.create({
      userId,
      doctorId,
      reason,
      date,
      duration,
      type
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
  const { userId, doctorId, reason, date, duration, type, status } = req.body;
  if (
    !userId ||
    !doctorId ||
    !reason ||
    !date ||
    !duration ||
    !type ||
    !status
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        userId,
        doctorId,
        reason,
        date,
        duration,
        type
      }
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
