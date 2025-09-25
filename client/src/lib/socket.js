import { io } from "socket.io-client";

// Determine the socket URL based on environment
const getSocketURL = () => {
  if (import.meta.env.PROD) {
    // Production: use same origin
    return window.location.origin;
  } else {
    // Development: use localhost:3001
    return "http://localhost:3001";
  }
};

// Create socket connection function
export const createSocketConnection = (options = {}) => {
  const socketURL = getSocketURL();
  
  const socketOptions = {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    forceNew: true,
    ...options
  };

  return io(socketURL, socketOptions);
};

// Export socket URL for reference
export const SOCKET_URL = getSocketURL();

export default createSocketConnection;
