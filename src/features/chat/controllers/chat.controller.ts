import { Request, Response, NextFunction } from "express";
import { ChatService } from "../services/chat.service";

import logger from "../../../middlewares/logger.middleware";
import { CreateConversationDto } from "../dtos/chat.dto";

export class ChatController {
  private chatService = new ChatService();

  createConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        logger.warn("Unauthorized attempt to create conversation");
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const dto: CreateConversationDto = req.body;
      const conversation = await this.chatService.createConversation(
        dto,
        userId
      );
      res.status(201).json(conversation);
    } catch (err) {
      logger.error("Error in createConversation:", err);
      next(err);
    }
  };

  getConversations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.userId;
      if (!userId || userId !== req.user?.id) {
        logger.warn("Unauthorized attempt to fetch conversations");
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const conversations = await this.chatService.getConversations(userId);
      res.json(conversations);
    } catch (err) {
      logger.error("Error in getConversations:", err);
      next(err);
    }
  };

  getMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const conversationId = req.params.conversationId;
      const messages = await this.chatService.getMessages(conversationId);
      res.json(messages);
    } catch (err) {
      logger.error("Error in getMessages:", err);
      next(err);
    }
  };
}
// import { Request, Response } from "express";
// import { ChatService } from "../services/chat.service";

// import logger from "../../../middlewares/logger.middleware";
// import { CreateConversationDto } from "../dtos/chat.dto";

// const chatService = new ChatService();

// export class ChatController {
//   async createConversation(req: Request, res: Response) {
//     try {
//       const userId = req.user?.userId;
//       if (!userId) {
//         logger.warn("Unauthorized attempt to create conversation");
//         return res.status(401).json({ error: "Unauthorized" });
//       }
//       const dto: CreateConversationDto = req.body;
//       const conversation = await chatService.createConversation(dto, userId);
//       res.status(201).json(conversation);
//     } catch (err) {
//       logger.error("Error in createConversation:", err);
//       throw err;
//     }
//   }

//   async getConversations(req: Request, res: Response) {
//     try {
//       const userId = req.params.userId;
//       if (!userId || userId !== req.user?.id) {
//         logger.warn("Unauthorized attempt to fetch conversations");
//         return res.status(401).json({ error: "Unauthorized" });
//       }
//       const conversations = await chatService.getConversations(userId);
//       res.json(conversations);
//     } catch (err) {
//       logger.error("Error in getConversations:", err);
//       throw err;
//     }
//   }

//   async getMessages(req: Request, res: Response) {
//     try {
//       const conversationId = req.params.conversationId;
//       const messages = await chatService.getMessages(conversationId);
//       res.json(messages);
//     } catch (err) {
//       logger.error("Error in getMessages:", err);
//       throw err;
//     }
//   }
// }
