import { io } from "socket.io-client";

/**
 * In prod: no URL → same-origin (https://instadoc.tn)
 * In dev:  use your local API port (4000)
 */
const DEV_URL = "http://localhost:4000"; // match your Node server port

export const socket = io(import.meta.env.PROD ? undefined : DEV_URL, {
  // default Socket.IO path is /socket.io (matches our Nginx block)
  path: "/socket.io",
  autoConnect: false,
  // If you rely on cookies, keep this:
  withCredentials: true,
  // (optional) prefer websockets
  transports: ["websocket"],
  // (optional) send auth if you use it elsewhere
  // auth: { token: getToken(), userId, apptId }
});