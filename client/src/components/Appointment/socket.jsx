import { io } from "socket.io-client";

const URL = "https://instadoc-api.onrender.com";

export const socket = io(URL, {
  autoConnect: false
});
