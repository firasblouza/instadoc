const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
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
    required: true,
    default: Date.now
  },
  role: {
    type: String,
    enum: ["user", "doctor", "admin"],
    default: "user"
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  sex: {
    type: String
  },
  allergies: [
    {
      type: String
    }
  ],
  medicalHistory: [
    {
      date: {
        type: Date
      },
      entry: {
        type: String
      }
    }
  ],
  refreshToken: {
    type: String
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
