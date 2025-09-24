const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const verifyJWT = require("../middleware/verifyJWT");
const verifyRole = require("../middleware/verifyRole");

// All notification routes require authentication
router.use(verifyJWT);

// User notification routes
router.get("/user/:userId", notificationController.getUserNotifications);
router.get("/user/:userId/unread-count", notificationController.getUnreadCount);
router.put("/:id/read", notificationController.markAsRead);
router.put("/user/:userId/read-all", notificationController.markAllAsRead);
router.delete("/:id", notificationController.deleteNotification);

// Admin notification routes
router.post("/", verifyRole("admin"), notificationController.createNotification);
router.post("/bulk", verifyRole("admin"), notificationController.createBulkNotifications);

module.exports = router;

