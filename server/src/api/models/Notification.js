const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      "welcome",
      "appointment",
      "doctor_pending", 
      "user_signup",
      "approval",
      "rejection",
      "profile",
      "system",
      "reminder",
      "payment",
      "other"
    ]
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  },
  actionUrl: {
    type: String // URL to navigate to when notification is clicked
  },
  metadata: {
    type: Schema.Types.Mixed // Additional data related to the notification
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;

