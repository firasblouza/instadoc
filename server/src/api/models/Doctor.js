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
        required: true,
        default: "00:00"
      },
      endTime: {
        type: String,
        required: true,
        default: "00:00"
      },
      isAvailable: {
        type: Boolean,
        default: true,
        required: true
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
  cvImage: {
    type: String, // This is going to be a file path for the doctor's profile.
    required: true
  },
  verifiedStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    required: true
  },
  pendingApproval: {
    type: Boolean,
    required: true,
    default: false
  },
  refreshToken: {
    type: String
  }
});

doctorSchema.pre("save", function (next) {
  if (!this.isNew) {
    return next();
  }

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  this.availability = daysOfWeek.map((day, index) => ({
    dayOfWeek: index,
    startTime: "00:00",
    endTime: "00:00",
    isAvailable: true
  }));

  next();
});
const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
