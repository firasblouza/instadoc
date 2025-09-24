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
      res.status(404).json({ message: "Aucun rendez-vous trouvé" });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
  }
};

const getAppointmentById = async (req, res) => {
  const appointmentId = req.params.id;
  let id;
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) return res.status(401).json({ message: "Non autorisé" });
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (decoded) {
    id = decoded.UserInfo.id;
  }
  try {
    const appointment = await Appointment.findById(appointmentId).exec();
    if (appointment) {
      res.status(200).json(appointment);
    } else {
      res.status(404).json({ message: "Rendez-vous non trouvé" });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération du rendez-vous" });
  }
};

const getDoctorAppointments = async (req, res) => {
  const doctorId = req.params.id;
  try {
    const appointments = await Appointment.find({ doctorId }).exec();
    if (appointments) {
      res.status(200).json(appointments);
    } else {
      res.status(404).json({ message: "Aucun rendez-vous trouvé" });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
  }
};

const getDoctorProfileAppointments = async (req, res) => {
  const doctorId = req.params.id;
  try {
    const appointments = await Appointment.find({ doctorId }).exec();
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
  }
};

const getUserAppointments = async (req, res) => {
  const userId = req.params.id;
  try {
    const appointments = await Appointment.find({ userId }).exec();
    if (appointments) {
      res.status(200).json(appointments);
    } else {
      res.status(404).json({ message: "Aucun rendez-vous trouvé" });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous" });
  }
};

const scheduleAppointment = async (req, res) => {
  const { userId, doctorId, reason, date, startDateTime, durationMin } = req.body;
  if (!userId || !doctorId || !reason) {
    return res.status(400).json({ message: "Champs requis manquants" });
  }

  try {
    // If new time-based booking provided, perform conflict check
    let start = null;
    let end = null;
    if (startDateTime) {
      start = new Date(startDateTime);
      if (Number.isNaN(start.getTime())) {
        return res.status(400).json({ message: "Date de début invalide" });
      }
      // Prevent past bookings
      const now = new Date();
      if (start < now) {
        return res.status(400).json({ message: "L'heure de début doit être dans le futur" });
      }
      const duration = typeof durationMin === "number" && durationMin > 0 ? durationMin : 30; // default 30 minutes
      end = new Date(start.getTime() + duration * 60 * 1000);

      // Overlap condition: existing.start < new.end AND existing.end > new.start
      const overlapping = await Appointment.findOne({
        doctorId,
        status: { $in: ["approved"] },
        startDateTime: { $lt: end },
        endDateTime: { $gt: start }
      }).exec();

      if (overlapping) {
        return res.status(409).json({ message: "Le créneau sélectionné n'est pas disponible" });
      }
    }

    const newAppointment = await Appointment.create({
      userId,
      doctorId,
      reason,
      date: date || (start ? start.toISOString().substring(0, 10) : undefined),
      startDateTime: start || undefined,
      endDateTime: end || undefined
    });

    res.status(201).json({ message: "Rendez-vous créé avec succès", appointmentId: newAppointment._id });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création du rendez-vous" });
  }
};

const cancelAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const cancelledAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "cancelled" }
    ).exec();
    if (cancelledAppointment) {
      res.status(200).json({ message: "Rendez-vous annulé avec succès" });
    } else {
      res.status(404).json({ message: "Rendez-vous non trouvé" });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'annulation du rendez-vous" });
  }
};
const rejectAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const rejectedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "rejected" }
    ).exec();
    if (rejectedAppointment) {
      res.status(200).json({ message: "Rendez-vous rejeté avec succès" });
    } else {
      res.status(404).json({ message: "Rendez-vous non trouvé" });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du rejet du rendez-vous" });
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
      res.status(200).json({ message: "Rendez-vous mis à jour avec succès" });
    } else {
      res.status(404).json({ message: "Rendez-vous non trouvé" });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du rendez-vous" });
  }
};

const deleteAppointmentById = async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      appointmentId
    ).exec();
    if (deletedAppointment) {
      res.status(200).json({ message: "Rendez-vous supprimé avec succès" });
    } else {
      res.status(404).json({ message: "Rendez-vous non trouvé" });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression du rendez-vous" });
  }
};

const createMessage = async (req, res) => {
  const apptId = req.params.id;
  const { senderId, role, content, senderName, fileUrl, fileName, fileType } = req.body;

  if (!apptId) {
    return res.status(400).json({ message: "Mauvaise requête" });
  }

  if (!senderId || !role || !content || !senderName) {
    return res.status(400).json({ message: "Mauvaise requête, données manquantes" });
  }

  const messageObj = {
    senderId,
    senderName,
    role,
    content,
    fileUrl,
    fileName,
    fileType
  };

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      apptId,
      { $push: { messages: messageObj } },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    res
      .status(200)
      .json({ message: "Message envoyé avec succès", updatedAppointment });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const uploadChatFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({ 
    message: 'File uploaded successfully', 
    fileUrl: fileUrl,
    fileName: req.file.originalname,
    fileType: req.file.mimetype.startsWith('image/') ? 'image' : 'file'
  });
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  getDoctorAppointments,
  getUserAppointments,
  scheduleAppointment,
  modifyAppointmentById,
  cancelAppointment,
  rejectAppointment,
  deleteAppointmentById,
  createMessage,
  uploadChatFile
};
