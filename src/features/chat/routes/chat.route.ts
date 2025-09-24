import { Router } from "express";

import { authMiddleware } from "../../../middlewares/authMiddleware";
import { ChatController } from "../controllers/chat.controller";

const chatRoutes = Router();
const chatController = new ChatController();

chatRoutes.post(
  "/conversations",
  authMiddleware,
  chatController.createConversation.bind(chatController)
);
chatRoutes.get(
  "/conversations/:userId",
  authMiddleware,
  chatController.getConversations.bind(chatController)
);
chatRoutes.get(
  "/conversations/:conversationId/messages",
  authMiddleware,
  chatController.getMessages.bind(chatController)
);

export default chatRoutes;
