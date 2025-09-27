"use strict";
// import express from "express";
// import indexMiddleware from "./middlewares/index.middleware";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.httpServer = exports.app = void 0;
// const app = express();
// indexMiddleware(app);
// export default app;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const index_middleware_1 = __importDefault(require("./middlewares/index.middleware"));
const chat_socket_1 = require("./features/chat/socket/chat.socket");
const app = (0, express_1.default)();
exports.app = app;
const httpServer = (0, http_1.createServer)(app);
exports.httpServer = httpServer;
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    },
});
exports.io = io;
// Apply existing middleware (includes /api/v1 routes)
(0, index_middleware_1.default)(app);
// Initialize Socket.IO
(0, chat_socket_1.setupSocket)(io);
