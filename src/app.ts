// import express from "express";
// import indexMiddleware from "./middlewares/index.middleware";

// const app = express();
// indexMiddleware(app);
// export default app;

import express, { Application } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import indexMiddleware from "./middlewares/index.middleware";
import { setupSocket } from "./features/chat/socket/chat.socket";

const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// Apply existing middleware (includes /api/v1 routes)
indexMiddleware(app);

// Initialize Socket.IO
setupSocket(io);

export { app, httpServer, io };
