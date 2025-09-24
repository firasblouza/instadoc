import { useState, useEffect, createContext, useContext } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaExclamationCircle } from "react-icons/fa";

const ToastContext = createContext({});

/* eslint-disable react/prop-types */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info", duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      duration
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Convenience methods
  const showSuccess = (message, duration) => addToast(message, "success", duration);
  const showError = (message, duration) => addToast(message, "error", duration);
  const showWarning = (message, duration) => addToast(message, "warning", duration);
  const showInfo = (message, duration) => addToast(message, "info", duration);

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
        showSuccess,
        showError,
        showWarning,
        showInfo
      }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-40 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getToastStyles = () => {
    const baseStyles = "flex items-center gap-3 p-4 rounded-lg shadow-lg border transform transition-all duration-300 max-w-sm";
    
    if (isLeaving) {
      return `${baseStyles} translate-x-full opacity-0`;
    }
    
    if (!isVisible) {
      return `${baseStyles} translate-x-full opacity-0`;
    }

    const typeStyles = {
      success: "bg-green-50 border-green-200 text-green-800",
      error: "bg-red-50 border-red-200 text-red-800",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
      info: "bg-blue-50 border-blue-200 text-blue-800"
    };

    return `${baseStyles} translate-x-0 opacity-100 ${typeStyles[toast.type]}`;
  };

  const getIcon = () => {
    const iconClass = "text-lg flex-shrink-0";
    
    switch (toast.type) {
      case "success":
        return <FaCheckCircle className={`${iconClass} text-green-500`} />;
      case "error":
        return <FaExclamationCircle className={`${iconClass} text-red-500`} />;
      case "warning":
        return <FaExclamationTriangle className={`${iconClass} text-yellow-500`} />;
      case "info":
        return <FaInfoCircle className={`${iconClass} text-blue-500`} />;
      default:
        return <FaInfoCircle className={`${iconClass} text-blue-500`} />;
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={handleRemove}
        className="text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        <FaTimes className="text-sm" />
      </button>
    </div>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastContext;
