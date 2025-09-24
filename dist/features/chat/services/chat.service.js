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
exports.ChatService = void 0;
const client_1 = require("@prisma/client");
const logger_middleware_1 = __importDefault(require("../../../middlewares/logger.middleware"));
const prisma = new client_1.PrismaClient();
class ChatService {
    createConversation(dto, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ensure user is part of the conversation
                if (!dto.participantIds.includes(userId)) {
                    dto.participantIds.push(userId);
                }
                const conversation = yield prisma.conversation.create({
                    data: {
                        participants: {
                            create: dto.participantIds.map((id) => ({
                                user: { connect: { id } },
                            })),
                        },
                    },
                    include: {
                        participants: {
                            include: {
                                user: { select: { id: true, firstname: true, lastname: true } },
                            },
                        },
                    },
                });
                logger_middleware_1.default.info(`Created conversation ${conversation.id} for user ${userId}`);
                return conversation;
            }
            catch (err) {
                logger_middleware_1.default.error("Error creating conversation:", err);
                throw err;
            }
        });
    }
    getConversations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversations = yield prisma.conversation.findMany({
                    where: { participants: { some: { userId } } },
                    include: {
                        participants: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstname: true,
                                        lastname: true,
                                        avatar: true,
                                    },
                                },
                            },
                        },
                        lastMessage: true,
                    },
                    orderBy: { updatedAt: "desc" },
                });
                logger_middleware_1.default.info(`Fetched conversations for user ${userId}`);
                return conversations;
            }
            catch (err) {
                logger_middleware_1.default.error("Error fetching conversations:", err);
                throw err;
            }
        });
    }
    getMessages(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield prisma.message.findMany({
                    where: { conversationId },
                    include: {
                        sender: {
                            select: { id: true, firstname: true, lastname: true, avatar: true },
                        },
                    },
                    orderBy: { createdAt: "asc" },
                });
                logger_middleware_1.default.info(`Fetched messages for conversation ${conversationId}`);
                return messages;
            }
            catch (err) {
                logger_middleware_1.default.error("Error fetching messages:", err);
                throw err;
            }
        });
    }
    sendMessage(dto, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield prisma.message.create({
                    data: {
                        content: dto.content,
                        conversation: { connect: { id: dto.conversationId } },
                        sender: { connect: { id: senderId } },
                    },
                    include: {
                        sender: {
                            select: { id: true, firstname: true, lastname: true, avatar: true },
                        },
                    },
                });
                // Update last message reference
                yield prisma.conversation.update({
                    where: { id: dto.conversationId },
                    data: { lastMessageId: message.id },
                });
                logger_middleware_1.default.info(`Sent message ${message.id} in conversation ${dto.conversationId}`);
                return message;
            }
            catch (err) {
                logger_middleware_1.default.error("Error sending message:", err);
                throw err;
            }
        });
    }
    updateConversationLastMessage(conversationId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversation = yield prisma.conversation.update({
                    where: { id: conversationId },
                    data: { lastMessageId: messageId },
                });
                logger_middleware_1.default.info(`Updated last message for conversation ${conversationId}`);
                return conversation;
            }
            catch (err) {
                logger_middleware_1.default.error("Error updating conversation:", err);
                throw err;
            }
        });
    }
}
exports.ChatService = ChatService;
// import { PrismaClient } from "@prisma/client";
// import logger from "../../../middlewares/logger.middleware";
// import { CreateConversationDto, SendMessageDto } from "../dtos/chat.dto";
// const prisma = new PrismaClient();
// export class ChatService {
//   async createConversation(dto: CreateConversationDto, userId: string) {
//     try {
//       // Ensure userId is included in participants
//       if (!dto.participantIds.includes(userId)) {
//         dto.participantIds.push(userId);
//       }
//       const conversation = await prisma.conversation.create({
//         data: {
//           participants: { connect: dto.participantIds.map((id) => ({ id })) },
//         },
//         include: { participants: { select: { username: true } } },
//       });
//       logger.info(`Created conversation ${conversation.id} for user ${userId}`);
//       return conversation;
//     } catch (err) {
//       logger.error("Error creating conversation:", err);
//       throw err;
//     }
//   }
//   async getConversations(userId: string) {
//     try {
//       const conversations = await prisma.conversation.findMany({
//         where: { participants: { some: { id: userId } } },
//         include: {
//           participants: { select: { username: true, id: true } },
//           lastMessage: true,
//         },
//         orderBy: { updatedAt: "desc" },
//       });
//       logger.info(`Fetched conversations for user ${userId}`);
//       return conversations;
//     } catch (err) {
//       logger.error("Error fetching conversations:", err);
//       throw err;
//     }
//   }
//   async getMessages(conversationId: string) {
//     try {
//       const messages = await prisma.message.findMany({
//         where: { conversationId },
//         include: { sender: { select: { username: true, id: true } } },
//         orderBy: { createdAt: "asc" },
//       });
//       logger.info(`Fetched messages for conversation ${conversationId}`);
//       return messages;
//     } catch (err) {
//       logger.error("Error fetching messages:", err);
//       throw err;
//     }
//   }
//   async sendMessage(dto: SendMessageDto, senderId: string) {
//     try {
//       const message = await prisma.message.create({
//         data: {
//           content: dto.content,
//           conversation: { connect: { id: dto.conversationId } },
//           sender: { connect: { id: senderId } },
//         },
//         include: { sender: { select: { username: true, id: true } } },
//       });
//       logger.info(
//         `Sent message ${message.id} in conversation ${dto.conversationId}`
//       );
//       return message;
//     } catch (err) {
//       logger.error("Error sending message:", err);
//       throw err;
//     }
//   }
//   async updateConversationLastMessage(
//     conversationId: string,
//     messageId: string
//   ) {
//     try {
//       const conversation = await prisma.conversation.update({
//         where: { id: conversationId },
//         data: { lastMessage: { connect: { id: messageId } } },
//       });
//       logger.info(`Updated last message for conversation ${conversationId}`);
//       return conversation;
//     } catch (err) {
//       logger.error("Error updating conversation:", err);
//       throw err;
//     }
//   }
// }
