"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = setupSocket;
const logger_middleware_1 = __importDefault(require("../../../middlewares/logger.middleware"));
const chat_service_1 = require("../services/chat.service");
const chatService = new chat_service_1.ChatService();
function setupSocket(io) {
    io.on("connection", (socket) => {
        logger_middleware_1.default.info(`User connected: ${socket.id}`);
        socket.on("joinConversation", (_a) => __awaiter(this, [_a], void 0, function* ({ conversationId, userId, }) {
            socket.join(conversationId);
            logger_middleware_1.default.info(`User ${userId} joined conversation ${conversationId}`);
        }));
        socket.on("sendMessage", (_a) => __awaiter(this, [_a], void 0, function* ({ conversationId, userId, content, }) {
            try {
                const message = yield chatService.sendMessage({ conversationId, content }, userId);
                yield chatService.updateConversationLastMessage(conversationId, message.id);
                io.to(conversationId).emit("receiveMessage", message);
                logger_middleware_1.default.info(`Message sent in conversation ${conversationId} by user ${userId}`);
            }
            catch (err) {
                logger_middleware_1.default.error("Error sending message:", err);
            }
        }));
        socket.on("disconnect", () => {
            logger_middleware_1.default.info(`User disconnected: ${socket.id}`);
        });
    });
}
