import { useContext, useRef, useEffect } from "react";
import { FaBell, FaCheck, FaTrashAlt, FaEye, FaUserMd, FaUser, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import NotificationContext from "../../context/NotificationContext";

const NotificationBell = ({ variant = "dashboard" }) => {
  const {
    notifications,
    unreadCount,
    loading,
    showNotifications,
    setShowNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getTimeAgo
  } = useContext(NotificationContext);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications, setShowNotifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment":
        return <FaCalendarAlt className="text-blue-500" />;
      case "doctor_pending":
        return <FaUserMd className="text-orange-500" />;
      case "user_signup":
        return <FaUser className="text-green-500" />;
      case "approval":
        return <FaCheckCircle className="text-green-500" />;
      case "profile":
        return <FaUser className="text-blue-500" />;
      case "welcome":
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaBell className="text-neutral-500" />;
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    // You can add navigation logic here based on notification type
  };

  const bellClasses = variant === "navbar" 
    ? "p-2 rounded-full hover:bg-neutral-100 transition-colors duration-200 relative"
    : "p-2 rounded-full hover:bg-neutral-200 relative";

  const bellIconClasses = variant === "navbar"
    ? "text-neutral-600"
    : "text-neutral-600";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className={bellClasses}
      >
        <FaBell className={bellIconClasses} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className={`absolute ${variant === "navbar" ? "right-0" : "right-0"} top-12 w-80 bg-white rounded-xl shadow-lg border border-neutral-200 z-50 max-h-96 overflow-hidden flex flex-col`}>
          {/* Header */}
          <div className="p-4 border-b border-neutral-200 bg-gradient-to-r from-sky-50 to-blue-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-800">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-sky-600 hover:text-sky-700 font-medium"
                  >
                    Tout marquer lu
                  </button>
                )}
                <span className="text-xs text-neutral-500">
                  {unreadCount} non lu{unreadCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500 mx-auto"></div>
                <p className="text-sm text-neutral-500 mt-2">Chargement...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <FaBell className="text-4xl text-neutral-300 mx-auto mb-2" />
                <p className="text-neutral-500">Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-neutral-50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm font-medium truncate ${
                            !notification.isRead ? 'text-neutral-900' : 'text-neutral-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2 ml-2">
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification._id);
                              }}
                              className="text-neutral-400 hover:text-red-500 transition-colors"
                            >
                              <FaTrashAlt className="text-xs" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-neutral-400 mt-2">
                          {getTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-neutral-200 bg-neutral-50">
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full text-center text-sm text-sky-600 hover:text-sky-700 font-medium"
              >
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
