import express from 'express';
import { createServer } from 'http';
import { initializeSocket } from './src/socket';
import { Config } from './src/config/index';
import bodyParser from 'body-parser';
import logger from './src/config/logger';

const app = express();
app.use(bodyParser.json());
const httpServer = createServer(app);
const PORT = Config.server.port;

// Initialize WebSocket server
const io = initializeSocket(httpServer);

// Endpoint to receive order updates
app.post('/order-update', (req, res) => {
  try {
    const event = req.body;
    const storeId = event.data?.storeId;
    
    if (storeId) {
      io.to(storeId).emit('order-update', event);
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: 'Missing storeId in event data' });
    }
  } catch (error) {
    logger.error('Error processing order update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

httpServer.listen(PORT, () => {
  console.log(`WebSocket service listening on port ${PORT}`);
});