const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  dateTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 1
  },
  status: {
    type: String,
    enum: ["pending", "approved", "completed", "cancelled"],
    default: "pending"
  }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
