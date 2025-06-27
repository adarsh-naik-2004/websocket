import { Server } from "socket.io";
import { Config } from './config/index';

export const initializeSocket = (httpServer) => {
  const ALLOWED_DOMAINS = [
    Config.frontend.clientUI,
    Config.frontend.adminUI,
  ];

  const io = new Server(httpServer, { 
    cors: { 
      origin: ALLOWED_DOMAINS,
      methods: ["GET", "POST"]
    } 
  });

  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);

    socket.on("join", (data) => {
      socket.join(String(data.storeId));
      socket.emit("join", { roomId: String(data.storeId) });
    });
  });

  return io;
};