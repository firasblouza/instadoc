import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { api } from "../lib/api";
import useAccessToken from "../hooks/useAccessToken";
import AuthContext from "./AuthContext";
import { createSocketConnection } from "../lib/socket";
import { useToast } from "../components/Notifications/ToastContainer";

const NotificationContext = createContext({});

/* eslint-disable react/prop-types */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { accessToken, decodedToken } = useAccessToken();
  const { API_URL } = useContext(AuthContext);
  const { showInfo, showSuccess, showWarning } = useToast();

  // Fetch notifications from the server
  const fetchNotifications = useCallback(async (showLoadingState = true) => {
    if (!accessToken || !decodedToken?.UserInfo?.id) return;

    try {
      if (showLoadingState) {
        setLoading(true);
      }
      const response = await api.get(`/notifications/user/${decodedToken.UserInfo.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (response.status === 200) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // For now, use mock notifications if API fails
      setNotifications(getMockNotifications(decodedToken.UserInfo.role));
      setUnreadCount(getMockNotifications(decodedToken.UserInfo.role).filter(n => !n.isRead).length);
    } finally {
      if (showLoadingState) {
        setLoading(false);
      }
      setIsInitialized(true);
    }
  }, [accessToken, decodedToken]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Fallback: mark as read locally
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.put(`/notifications/user/${decodedToken.UserInfo.id}/read-all`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Fallback: mark all as read locally
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  // Add a new notification (for real-time updates)
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      const deletedNotification = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Get time ago string
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `il y a ${Math.floor(diffInMinutes / 60)} heure${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''}`;
    return `il y a ${Math.floor(diffInMinutes / 1440)} jour${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''}`;
  };

  // Mock notifications for testing (remove when backend is ready)
  const getMockNotifications = (userRole) => {
    const baseNotifications = [
      {
        _id: "1",
        title: "Bienvenue sur InstaCure",
        message: "Votre compte a été créé avec succès. Découvrez toutes les fonctionnalités disponibles.",
        type: "welcome",
        isRead: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5 minutes ago
      },
      {
        _id: "2",
        title: "Mise à jour du profil",
        message: "N'oubliez pas de compléter votre profil pour une meilleure expérience.",
        type: "profile",
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      }
    ];

    if (userRole === "doctor") {
      return [
        ...baseNotifications,
        {
          _id: "3",
          title: "Nouvelle demande de consultation",
          message: "Un patient souhaite prendre rendez-vous avec vous.",
          type: "appointment",
          isRead: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
        },
        {
          _id: "4",
          title: "Profil vérifié",
          message: "Votre profil médical a été approuvé par l'administration.",
          type: "approval",
          isRead: false,
          createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 hour ago
        }
      ];
    } else if (userRole === "user") {
      return [
        ...baseNotifications,
        {
          _id: "3",
          title: "Rendez-vous confirmé",
          message: "Votre rendez-vous avec Dr. Martin a été confirmé pour demain à 14h30.",
          type: "appointment",
          isRead: false,
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 minutes ago
        }
      ];
    } else if (userRole === "admin") {
      return [
        ...baseNotifications,
        {
          _id: "3",
          title: "Nouveau médecin en attente",
          message: "Dr. Sophie Dubois attend l'approbation de son profil.",
          type: "doctor_pending",
          isRead: false,
          createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() // 10 minutes ago
        },
        {
          _id: "4",
          title: "Nouveau patient inscrit",
          message: "Jean Dupont vient de créer un compte patient.",
          type: "user_signup",
          isRead: false,
          createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45 minutes ago
        }
      ];
    }

    return baseNotifications;
  };

  // Fetch notifications on component mount and when user changes
  useEffect(() => {
    if (accessToken && decodedToken?.UserInfo?.id && !isInitialized) {
      fetchNotifications(true);
    }
  }, [accessToken, decodedToken, isInitialized, fetchNotifications]);

  // WebSocket for real-time notifications
  useEffect(() => {
    if (!accessToken || !decodedToken?.UserInfo?.id || !isInitialized) return;

    const socket = createSocketConnection({
      auth: {
        token: accessToken,
        userId: decodedToken.UserInfo.id
      }
    });

    // Connect the socket
    socket.connect();

    // Handle connection events
    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    // Listen for new notifications
    socket.on("new-notification", (notification) => {
      console.log("📱 New notification received:", notification);
      console.log("📱 Current user ID:", decodedToken?.UserInfo?.id);
      console.log("📱 Notification user ID:", notification.userId);
      
      setNotifications(prev => [notification, ...prev]);
      if (!notification.isRead) {
        setUnreadCount(prev => prev + 1);
      }

      // Show toast for high priority notifications
      if (notification.priority === "high") {
        if (notification.type === "appointment") {
          // Check if it's a rejection by looking at the title
          if (notification.title.includes("rejeté") || notification.title.includes("rejetée")) {
            showWarning(`⚠️ ${notification.title}: ${notification.message}`);
          } else {
            showInfo(`📅 ${notification.title}: ${notification.message}`);
          }
        } else if (notification.type === "approval") {
          showSuccess(`✅ ${notification.title}: ${notification.message}`);
        } else if (notification.type === "rejection") {
          showWarning(`⚠️ ${notification.title}: ${notification.message}`);
        } else {
          showInfo(`🔔 ${notification.title}`);
        }
      }
    });

    // Listen for notification updates
    socket.on("notification-updated", (updatedNotification) => {
      setNotifications(prev => 
        prev.map(n => 
          n._id === updatedNotification._id ? updatedNotification : n
        )
      );
    });

    // Fallback: Still check every 5 minutes for missed notifications
    const interval = setInterval(() => {
      fetchNotifications(false);
    }, 300000); // 5 minutes

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [accessToken, decodedToken, isInitialized, API_URL, fetchNotifications, showInfo, showSuccess, showWarning]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        showNotifications,
        setShowNotifications,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        addNotification,
        deleteNotification,
        getTimeAgo
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
