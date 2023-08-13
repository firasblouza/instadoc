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
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ["Chat", "Video"],
    required: true
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled"
  }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
