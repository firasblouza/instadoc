import { createSocketConnection } from "../../lib/socket";

/**
 * Create socket connection for appointments
 * Uses centralized socket configuration
 */
export const socket = createSocketConnection({
  path: "/socket.io",
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});