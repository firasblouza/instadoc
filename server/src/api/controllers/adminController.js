const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Lab = require("../models/Lab");

const fetchStatistics = async (req, res) => {
  try {
    const patients = await User.countDocuments({ role: "user" });
    const consultations = await Appointment.countDocuments({});
    const doctors = await Doctor.countDocuments({});
    const labs = await Lab.countDocuments({});

    if (!patients || !consultations || !doctors) {
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json({ patients, consultations, doctors, labs });
  } catch (err) {
    console.error(err);
  }
};

module.exports = { fetchStatistics };
