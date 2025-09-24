const mongoose = require("mongoose");
const Notification = require("./src/api/models/Notification");
const User = require("./src/api/models/User");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/instadoc", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedNotifications() {
  try {
    console.log("🔔 Seeding notifications...");
    
    // Get some users to create notifications for
    const users = await User.find({}).limit(5);
    console.log(`Found ${users.length} users`);

    if (users.length === 0) {
      console.log("No users found. Please create some users first.");
      return;
    }

    // Clear existing notifications
    await Notification.deleteMany({});
    console.log("Cleared existing notifications");

    const notifications = [];

    // Create notifications for each user
    for (const user of users) {
      const baseNotifications = [
        {
          userId: user._id,
          title: "Bienvenue sur InstaDoc",
          message: "Votre compte a été créé avec succès. Découvrez toutes les fonctionnalités disponibles.",
          type: "welcome",
          isRead: false,
          priority: "medium",
          actionUrl: "/dashboard"
        },
        {
          userId: user._id,
          title: "Mise à jour du profil",
          message: "N'oubliez pas de compléter votre profil pour une meilleure expérience.",
          type: "profile",
          isRead: true,
          priority: "low",
          actionUrl: "/dashboard/profile"
        }
      ];

      // Role-specific notifications
      if (user.role === "doctor") {
        baseNotifications.push({
          userId: user._id,
          title: "Nouvelle demande de consultation",
          message: "Un patient souhaite prendre rendez-vous avec vous.",
          type: "appointment",
          isRead: false,
          priority: "high",
          actionUrl: "/dashboard/consultations"
        });
      } else if (user.role === "user") {
        baseNotifications.push({
          userId: user._id,
          title: "Rendez-vous confirmé",
          message: "Votre rendez-vous a été confirmé pour demain à 14h30.",
          type: "appointment",
          isRead: false,
          priority: "high",
          actionUrl: "/dashboard/consultations"
        });
      } else if (user.role === "admin") {
        baseNotifications.push({
          userId: user._id,
          title: "Nouveau médecin en attente",
          message: "Un nouveau médecin attend l'approbation de son profil.",
          type: "doctor_pending",
          isRead: false,
          priority: "medium",
          actionUrl: "/dashboard/admin/doctors"
        });
      }

      notifications.push(...baseNotifications);
    }

    // Insert notifications
    const insertedNotifications = await Notification.insertMany(notifications);
    console.log(`✅ Successfully inserted ${insertedNotifications.length} notifications`);

    // Display summary
    const summary = {};
    insertedNotifications.forEach(n => {
      summary[n.type] = (summary[n.type] || 0) + 1;
    });

    console.log("📊 Notification summary by type:");
    Object.entries(summary).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

  } catch (error) {
    console.error("❌ Error seeding notifications:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Run the seeding function
seedNotifications();

