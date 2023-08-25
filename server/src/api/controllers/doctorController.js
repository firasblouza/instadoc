const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Rating = require("../models/Rating");
const bcrypt = require("bcrypt");
const { request } = require("express");

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
  const contentType = req.headers["content-type"];
  let userData = {};

  if (contentType.includes("multipart/form-data")) {
    if (req.body && req.body.user) {
      userData = JSON.parse(req.body.user);
    }
  }

  if (contentType.includes("json")) {
    userData = req.body;
  }

  // Check for possible images to change regarding doctor
  if (req.files && req.files["profileImage"]) {
    userData.profileImage = req.files["profileImage"][0].filename;
  }
  if (req.files && req.files["cvImage"]) {
    userData.cvImage = req.files["cvImage"][0].filename;
  }
  if (req.files && req.files["licenseImage"]) {
    userData.profileImage = req.files["licenseImage"][0].filename;
  }

  try {
    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: userData }, // Use the $set operator to update fields present in userData
      { new: true } // Return the updated doctor object
    ).exec();
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
      verifiedStatus: "approved",
      pendingApproval: true
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

const modifyDoctorPasswordById = async (req, res) => {
  let id = req.params.id;
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await Doctor.findOne({ _id: id }).exec();
    if (user) {
      const validatePassword = await bcrypt.compare(oldPassword, user.password);

      if (!validatePassword) {
        console.log("password don't match");
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      } else {
        if (oldPassword === newPassword) {
          return res.status(409).json({
            message: "New password cannot be the same as old password"
          });
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        const update = await Doctor.findByIdAndUpdate(id, {
          password: hash
        });

        if (update) {
          res.status(200).json({ message: "Password updated successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Error while updating the password" });
  }
};

const fetchStatistics = async (req, res) => {
  const id = req.params.id;
  try {
    const consultations = await Appointment.countDocuments({ doctorId: id });

    const ratings = await Rating.countDocuments({ doctorId: id });

    if (!consultations || !ratings) {
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json({ consultations, ratings });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  modifyDoctorById,
  deleteDoctorById,
  getPendingDoctors,
  approveDoctorById,
  rejectDoctorById,
  modifyDoctorPasswordById,
  fetchStatistics
};
