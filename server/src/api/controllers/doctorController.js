const Doctor = require("../models/Doctor");

const getAllDoctors = async (req, res) => {
  // Parameters for the pagination
  const page = parseInt(req.query.page);
  const limit = 10;
  const skip = (page - 1) * limit;
  try {
    const doctors = await Doctor.find({}).select("-password").exec();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Error while fetching doctors" });
  }
};

const getDoctorById = async (req, res) => {
  const id = req.params.id;
  try {
    const doctor = await Doctor.findById(id).select("-password").exec();
    if (doctor) {
      res.status(200).json(doctor);
    } else {
      res.status(404).json({ message: "Doctor not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while fetching doctor" });
  }
};

const modifyDoctorById = async (req, res) => {
  const id = req.params.id;
  const { email, firstName, lastName, phoneNumber, verifiedStatus } = req.body;
  if (!email || !firstName || !lastName || !phoneNumber || !verifiedStatus) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  try {
    const doctor = await Doctor.findByIdAndUpdate(id, {
      email,
      firstName,
      lastName,
      phoneNumber,
      verifiedStatus
    }).exec();
    if (doctor) {
      res.status(200).json({ message: "Doctor updated successfully" });
    } else {
      res.status(404).json({ message: "Doctor not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while updating doctor" });
  }
};

const getPendingDoctors = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = 10;
  const skip = (page - 1) * limit;
  try {
    const doctors = await Doctor.find({ verifiedStatus: "pending" })
      .select("-password")
      .skip(skip)
      .limit(limit)
      .exec();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Error while fetching doctors" });
  }
};

const approveDoctorById = async (req, res) => {
  const id = req.params.id;
  try {
    const doctor = await Doctor.findByIdAndUpdate(id, {
      verifiedStatus: "approved"
    }).exec();
    if (doctor) {
      res.status(200).json({ message: "Doctor approved successfully" });
    } else {
      res.status(404).json({ message: "Doctor not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while approving doctor" });
  }
};

const rejectDoctorById = async (req, res) => {
  const id = req.params.id;
  try {
    const doctor = await Doctor.findByIdAndUpdate(id, {
      verifiedStatus: "rejected"
    }).exec();
    if (doctor) {
      res.status(200).json({ message: "Doctor rejected successfully" });
    } else {
      res.status(404).json({ message: "Doctor not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while rejecting doctor" });
  }
};

const deleteDoctorById = async (req, res) => {
  const id = req.params.id;
  try {
    const doctor = await Doctor.findByIdAndDelete(id).exec();
    if (doctor) {
      res.status(200).json({ message: "Doctor deleted successfully" });
    } else {
      res.status(404).json({ message: "Doctor not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error while deleting doctor" });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  modifyDoctorById,
  deleteDoctorById,
  getPendingDoctors,
  approveDoctorById,
  rejectDoctorById
};
