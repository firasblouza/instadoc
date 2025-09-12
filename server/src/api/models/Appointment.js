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
  // New time-based fields
  startDateTime: {
    type: Date
  },
  endDateTime: {
    type: Date
  },
  notes: {
    type: Array
  },
  duration: {
    type: Number,
    required: true,
    default: 1
  },

  messages: [
    {
      senderId: {
        type: String
      },
      senderName: {
        type: String
      },
      role: {
        type: String
      },
      content: {
        type: String
      },
      fileUrl: {
        type: String
      },
      fileName: {
        type: String
      },
      fileType: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  status: {
    type: String,
    enum: ["pending", "approved", "completed", "cancelled", "rejected"],
    default: "pending"
  }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
