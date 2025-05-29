import { createServer } from "node:http";
import { Server } from "socket.io";
import { Config } from './config/index'

const wsServer = createServer();

const ALLOWED_DOMAINS = [
  Config.frontend.clientUI,
  Config.frontend.adminUI,
];


const io = new Server(wsServer, { cors: { origin: ALLOWED_DOMAINS as string[]} });

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
