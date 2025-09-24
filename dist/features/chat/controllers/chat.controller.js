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
exports.ChatController = void 0;
const chat_service_1 = require("../services/chat.service");
const logger_middleware_1 = __importDefault(require("../../../middlewares/logger.middleware"));
class ChatController {
    constructor() {
        this.chatService = new chat_service_1.ChatService();
        this.createConversation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    logger_middleware_1.default.warn("Unauthorized attempt to create conversation");
                    res.status(401).json({ error: "Unauthorized" });
                    return;
                }
                const dto = req.body;
                const conversation = yield this.chatService.createConversation(dto, userId);
                res.status(201).json(conversation);
            }
            catch (err) {
                logger_middleware_1.default.error("Error in createConversation:", err);
                next(err);
            }
        });
        this.getConversations = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = req.params.userId;
                if (!userId || userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    logger_middleware_1.default.warn("Unauthorized attempt to fetch conversations");
                    res.status(401).json({ error: "Unauthorized" });
                    return;
                }
                const conversations = yield this.chatService.getConversations(userId);
                res.json(conversations);
            }
            catch (err) {
                logger_middleware_1.default.error("Error in getConversations:", err);
                next(err);
            }
        });
        this.getMessages = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const conversationId = req.params.conversationId;
                const messages = yield this.chatService.getMessages(conversationId);
                res.json(messages);
            }
            catch (err) {
                logger_middleware_1.default.error("Error in getMessages:", err);
                next(err);
            }
        });
    }
}
exports.ChatController = ChatController;
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
