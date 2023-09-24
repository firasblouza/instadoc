import { io } from "socket.io-client";

const URL = "wss://instadoc-api.onrender.com";

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"]
});
