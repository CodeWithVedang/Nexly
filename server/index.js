import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';

const app = express();
app.use(cors());

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Discovery Server running on port ${port}`);
});

const wss = new WebSocketServer({ server });

// In-memory store of active users. Map of ws client -> user object
const activeUsers = new Map();

function broadcastUsers() {
  const users = Array.from(activeUsers.values());
  const message = JSON.stringify({ type: 'users_update', users });
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on('connection', (ws) => {
  ws.on('message', (messageAsString) => {
    try {
      const data = JSON.parse(messageAsString);
      
      if (data.type === 'join') {
        // User joined
        activeUsers.set(ws, data.user);
        broadcastUsers();
        console.log(`${data.user.username} joined the network.`);
      }
    } catch (err) {
      console.error('Failed to parse message', err);
    }
  });

  ws.on('close', () => {
    const user = activeUsers.get(ws);
    if (user) {
      console.log(`${user.username} left the network.`);
      activeUsers.delete(ws);
      broadcastUsers();
    }
  });
});
