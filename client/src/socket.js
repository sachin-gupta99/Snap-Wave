import { io } from "socket.io-client";
import { host } from "./api/axiosInstance";

const socket = {
  current: io(host, {
    transports: ["websocket"],
    autoConnect: false,
  }),
};

export default socket;