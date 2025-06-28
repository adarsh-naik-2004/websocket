import express from "express";
import { createServer } from "http";
import { initializeSocket } from "./src/socket";
import { Config } from "./src/config/index";
import bodyParser from "body-parser";
import logger from "./src/config/logger";
import { OrderEvents } from "./src/utils";

const app = express();
app.use(bodyParser.json());
const httpServer = createServer(app);
const PORT = Config.server.port;

const io = initializeSocket(httpServer);

app.post("/order-update", (req, res) => {
  try {
    const event = req.body;
    const storeId = event.data?.storeId;

    if (storeId) {
      io.to(`store-${storeId}`).emit("order-update", event);

      // Also notify admin room
      io.to("admin-room").emit("order-update", event);
      if (event.event_type === OrderEvents.ORDER_STATUS_UPDATE) {
        const orderId = event.data?.orderId;
        if (orderId) {
          // Notify order-specific room
          io.to(`order-${orderId}`).emit("order-status-update", {
            orderId,
            orderStatus: event.data.orderStatus,
          });
        }
      }
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: "Missing storeId in event data" });
    }
  } catch (error) {
    logger.error("Error processing order update:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/notify-order", (req, res) => {
  try {
    const event = req.body;
    const { data } = event;

    // Handle status updates
    if (event.event_type === OrderEvents.ORDER_STATUS_UPDATE) {
      const orderId = data._id;
      const orderStatus = data.orderStatus;
      
      io.to(`order-${orderId}`).emit("order-status-update", {
        orderId,
        orderStatus
      });
    }

    if (data.storeId) {
      io.to(`store-${data.storeId}`).emit("order-update", event);
      io.to("admin-room").emit("order-update", event);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error("Error processing order update:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

httpServer.listen(PORT, () => {
  console.log(`WebSocket service listening on port ${PORT}`);
});
