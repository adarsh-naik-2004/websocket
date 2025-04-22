import { createServer } from "node:http";
import { Server } from "socket.io";

const wsServer = createServer();

const io = new Server(wsServer, { cors: { origin: "http://localhost:5173" } });

io.on("connection", (socket) => {
  console.log("Client connected", socket.id);

  socket.on("join", (data) => {
    socket.join(String(data.storeId));
    socket.emit("join", { roomId: String(data.storeId) });
  });
});

export default {
  wsServer,
  io,
};
