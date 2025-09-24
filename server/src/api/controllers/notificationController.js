const Notification = require("../models/Notification");
const User = require("../models/User");

// Get all notifications for a user
const getUserNotifications = async (req, res) => {
  const userId = req.params.userId;
  const { limit = 50, page = 1, unreadOnly = false } = req.query;

  try {
    const query = { userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .exec();

    const totalCount = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    res.status(200).json({
      notifications,
      totalCount,
      unreadCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit))
    });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Error while fetching notifications" });
  }
};

// Get unread count for a user
const getUnreadCount = async (req, res) => {
  const userId = req.params.userId;

  try {
    const unreadCount = await Notification.countDocuments({ 
      userId, 
      isRead: false 
    });
    
    res.status(200).json({ unreadCount });
  } catch (err) {
    console.error("Error fetching unread count:", err);
    res.status(500).json({ message: "Error while fetching unread count" });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  const notificationId = req.params.id;

  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (notification) {
      res.status(200).json({ message: "Notification marked as read", notification });
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ message: "Error while updating notification" });
  }
};

// Mark all notifications as read for a user
const markAllAsRead = async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ 
      message: "All notifications marked as read", 
      modifiedCount: result.modifiedCount 
    });
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
    res.status(500).json({ message: "Error while updating notifications" });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  const notificationId = req.params.id;

  try {
    const deletedNotification = await Notification.findByIdAndDelete(notificationId);
    
    if (deletedNotification) {
      res.status(200).json({ message: "Notification deleted successfully" });
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(500).json({ message: "Error while deleting notification" });
  }
};

// Create notification (for internal use or admin)
const createNotification = async (req, res) => {
  const { userId, title, message, type, priority, actionUrl, metadata } = req.body;

  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      priority: priority || "medium",
      actionUrl,
      metadata
    });

    // Broadcast notification via WebSocket
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${userId}`).emit('new-notification', notification);
    }

    res.status(201).json({ 
      message: "Notification created successfully", 
      notification 
    });
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ message: "Error while creating notification" });
  }
};

// Bulk create notifications (for system-wide announcements)
const createBulkNotifications = async (req, res) => {
  const { userIds, title, message, type, priority, actionUrl } = req.body;

  try {
    const notifications = userIds.map(userId => ({
      userId,
      title,
      message,
      type,
      priority: priority || "medium",
      actionUrl
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    res.status(201).json({ 
      message: `${createdNotifications.length} notifications created successfully`,
      count: createdNotifications.length
    });
  } catch (err) {
    console.error("Error creating bulk notifications:", err);
    res.status(500).json({ message: "Error while creating bulk notifications" });
  }
};

// Helper function to create notification for specific events
const createNotificationForEvent = async (eventType, data) => {
  try {
    let notificationData = {};

    switch (eventType) {
      case "appointment_created":
        notificationData = {
          userId: data.doctorId,
          title: "Nouvelle demande de consultation",
          message: `${data.patientName} souhaite prendre rendez-vous avec vous.`,
          type: "appointment",
          priority: "high",
          actionUrl: "/dashboard/consultations",
          metadata: { appointmentId: data.appointmentId }
        };
        break;

      case "appointment_approved":
        notificationData = {
          userId: data.patientId,
          title: "Rendez-vous confirmé",
          message: `Votre rendez-vous avec Dr. ${data.doctorName} a été confirmé.`,
          type: "appointment",
          priority: "high",
          actionUrl: "/dashboard/consultations",
          metadata: { appointmentId: data.appointmentId }
        };
        break;

      case "doctor_approved":
        notificationData = {
          userId: data.doctorId,
          title: "Profil approuvé",
          message: "Félicitations! Votre profil médical a été approuvé par l'administration.",
          type: "approval",
          priority: "high",
          actionUrl: "/dashboard/profile"
        };
        break;

      case "doctor_rejected":
        notificationData = {
          userId: data.doctorId,
          title: "Profil rejeté",
          message: "Votre profil médical nécessite des modifications. Veuillez consulter les commentaires.",
          type: "rejection",
          priority: "high",
          actionUrl: "/dashboard/profile"
        };
        break;

      case "user_welcome":
        notificationData = {
          userId: data.userId,
          title: "Bienvenue sur InstaDoc",
          message: "Votre compte a été créé avec succès. Découvrez toutes nos fonctionnalités!",
          type: "welcome",
          priority: "medium",
          actionUrl: "/dashboard"
        };
        break;

      default:
        return null;
    }

    await Notification.create(notificationData);
    return notificationData;
  } catch (error) {
    console.error("Error creating event notification:", error);
    return null;
  }
};

module.exports = {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  createBulkNotifications,
  createNotificationForEvent
};
