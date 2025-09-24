import { Server, Socket } from "socket.io";
import logger from "../../../middlewares/logger.middleware";
import { SendMessageDto } from "../dtos/chat.dto";
import { ChatService } from "../services/chat.service";

const chatService = new ChatService();

export function setupSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on(
      "joinConversation",
      async ({
        conversationId,
        userId,
      }: {
        conversationId: string;
        userId: string;
      }) => {
        socket.join(conversationId);
        logger.info(`User ${userId} joined conversation ${conversationId}`);
      }
    );

    socket.on(
      "sendMessage",
      async ({
        conversationId,
        userId,
        content,
      }: SendMessageDto & { userId: string }) => {
        try {
          const message = await chatService.sendMessage(
            { conversationId, content },
            userId
          );
          await chatService.updateConversationLastMessage(
            conversationId,
            message.id
          );
          io.to(conversationId).emit("receiveMessage", message);
          logger.info(
            `Message sent in conversation ${conversationId} by user ${userId}`
          );
        } catch (err) {
          logger.error("Error sending message:", err);
        }
      }
    );

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });
}
