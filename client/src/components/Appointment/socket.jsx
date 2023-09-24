import { io } from "socket.io-client";

const URL = "ws://instadoc-api.onrender.com";

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"]
});
