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

// Helpers for available slots
const parseHHMM = (hhmm) => {
  const [h, m] = (hhmm || "00:00").split(":").map((v) => parseInt(v, 10));
  return { h: isNaN(h) ? 0 : h, m: isNaN(m) ? 0 : m };
};

const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);

const ymdLocal = (d) => {
  // Return YYYY-MM-DD in local time
  return d.toLocaleDateString('en-CA');
};

const getAvailableSlots = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { start, end, slotMinutes } = req.query;
    const slotSize = Math.max(parseInt(slotMinutes || "30", 10), 5);

    const doctor = await Doctor.findById(doctorId).select("availability scheduleV2").exec();
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const rangeStart = start ? new Date(start) : new Date();
    const rangeEnd = end ? new Date(end) : addMinutes(rangeStart, 60 * 24 * 14); // default 14 days

    if (isNaN(rangeStart.getTime()) || isNaN(rangeEnd.getTime())) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    const now = new Date();

    // Fetch approved appointments in range
    const appts = await Appointment.find({
      doctorId,
      status: { $in: ["approved"] },
      startDateTime: { $gte: rangeStart, $lt: rangeEnd }
    })
      .select("startDateTime endDateTime")
      .exec();

    const isOverlapping = (startA, endA, startB, endB) => startA < endB && endA > startB;

    const results = [];
    const dayMs = 24 * 60 * 60 * 1000;
    const startMidnight = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate()).getTime();
    const endExclusive = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate()).getTime();
    const v2 = doctor.scheduleV2 || [];
    const useV2Globally = Array.isArray(v2) && v2.some((d) => d && Array.isArray(d.ranges) && d.ranges.length > 0);

    for (let t = startMidnight; t < endExclusive; t += dayMs) {
      const day = new Date(t);
      const jsDow = day.getDay(); // 0 Sun .. 6 Sat
      // DB uses Monday=0..Sunday=6 (new). Some legacy data may use Sunday=0..Saturday=6.
      const dbDowMonFirst = (jsDow + 6) % 7; // preferred
      const dbDowSunFirst = jsDow;           // legacy

      // Prefer scheduleV2 if present
      const rangesV2 = (() => {
        const dayEntry = v2.find((d) => d && d.day === dbDowMonFirst);
        if (!dayEntry || !Array.isArray(dayEntry.ranges) || dayEntry.ranges.length === 0) return [];
        return dayEntry.ranges
          .map((r) => ({ start: parseHHMM(r.start), end: parseHHMM(r.end) }))
          .filter((r) => (r.end.h * 60 + r.end.m) > (r.start.h * 60 + r.start.m));
      })();

      let ranges = rangesV2;

      // Fallback to legacy availability (single range per day) ONLY if V2 is not in use anywhere
      if ((!ranges || ranges.length === 0) && !useV2Globally) {
        const candidates = (doctor.availability || []).filter(
          (s) => s && s.isAvailable && (s.dayOfWeek === dbDowMonFirst || s.dayOfWeek === dbDowSunFirst)
        );
        if (candidates && candidates.length > 0) {
          let best = null;
          let bestSpan = -1;
          for (const s of candidates) {
            const { h: sh0, m: sm0 } = parseHHMM(s.startTime);
            const { h: eh0, m: em0 } = parseHHMM(s.endTime);
            const span = eh0 * 60 + em0 - (sh0 * 60 + sm0);
            if (span > bestSpan) {
              best = { start: { h: sh0, m: sm0 }, end: { h: eh0, m: em0 } };
              bestSpan = span;
            }
          }
          ranges = bestSpan > 0 ? [best] : [];
        } else {
          ranges = [];
        }
      }

      for (const r of ranges) {
        const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), r.start.h, r.start.m);
        const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), r.end.h, r.end.m);
        if (!(dayEnd > dayStart)) continue;

        for (let slotStart = new Date(dayStart); addMinutes(slotStart, slotSize) <= dayEnd; slotStart = addMinutes(slotStart, slotSize)) {
          const slotEnd = addMinutes(slotStart, slotSize);
          // Skip past times on current day
          if (
            slotStart.getFullYear() === now.getFullYear() &&
            slotStart.getMonth() === now.getMonth() &&
            slotStart.getDate() === now.getDate() &&
            slotStart < now
          ) {
            continue;
          }
          const conflict = appts.some((a) => isOverlapping(slotStart, slotEnd, a.startDateTime, a.endDateTime));
          if (!conflict) {
            results.push({
              date: ymdLocal(day),
              start: slotStart.toISOString(),
              end: slotEnd.toISOString()
            });
          }
        }
      }
    }

    res.status(200).json({ slots: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error computing available slots" });
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
  fetchStatistics,
  getAvailableSlots
};
