import { Server } from "socket.io";
import { Config } from "./config/index";

export const initializeSocket = (httpServer) => {
  const ALLOWED_DOMAINS = [Config.frontend.clientUI, Config.frontend.adminUI];

  const io = new Server(httpServer, {
    cors: {
      origin: ALLOWED_DOMAINS,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);

    socket.on("join-store", (data) => {
      if (!data.storeId) return;
      const roomId = `store-${data.storeId}`;
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined store room: ${roomId}`);
      socket.emit("join-ack", { roomId });
    });

    // Join admin room
    socket.on("join-admin", () => {
      socket.join("admin-room");
      console.log(`Socket ${socket.id} joined admin room`);
      socket.emit("join-ack", { roomId: "admin-room" });
    });

    socket.on("join-order", (data) => {
      if (!data.orderId) return;
      const roomId = `order-${data.orderId}`;
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined order room: ${roomId}`);
    });
  });

  return io;
};
