const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  role: {
    type: String,
    default: "doctor"
  },
  profileImage: {
    type: String, // This is going to be a file path for the doctor's profile.
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  speciality: {
    type: String,
    required: true
  },
  availability: [
    {
      dayOfWeek: {
        type: Number,
        required: true
      },
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      isAvailable: {
        type: Boolean,
        default: true
      }
    }
  ],
  idType: {
    type: String,
    required: true
  },
  idNumber: {
    type: String,
    required: true
  },
  idImage: {
    type: String, // This is going to be a file path for the doctor's ID.
    required: true
  },
  licenseNumber: {
    type: String,
    required: true
  },
  licenseImage: {
    type: String, // This is going to be a file path for the doctor's medical license.
    required: true
  },
  verifiedStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    required: true
  },
  refreshToken: {
    type: String
  }
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
