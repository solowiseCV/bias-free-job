import { PrismaClient } from "@prisma/client";
import logger from "../../../middlewares/logger.middleware";
import { CreateConversationDto, SendMessageDto } from "../dtos/chat.dto";

const prisma = new PrismaClient();

export class ChatService {
  async createConversation(dto: CreateConversationDto, userId: string) {
    try {
      // Ensure user is part of the conversation
      if (!dto.participantIds.includes(userId)) {
        dto.participantIds.push(userId);
      }

      const conversation = await prisma.conversation.create({
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

      logger.info(`Created conversation ${conversation.id} for user ${userId}`);
      return conversation;
    } catch (err) {
      logger.error("Error creating conversation:", err);
      throw err;
    }
  }

  async getConversations(userId: string) {
    try {
      const conversations = await prisma.conversation.findMany({
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

      logger.info(`Fetched conversations for user ${userId}`);
      return conversations;
    } catch (err) {
      logger.error("Error fetching conversations:", err);
      throw err;
    }
  }

  async getMessages(conversationId: string) {
    try {
      const messages = await prisma.message.findMany({
        where: { conversationId },
        include: {
          sender: {
            select: { id: true, firstname: true, lastname: true, avatar: true },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      logger.info(`Fetched messages for conversation ${conversationId}`);
      return messages;
    } catch (err) {
      logger.error("Error fetching messages:", err);
      throw err;
    }
  }

  async sendMessage(dto: SendMessageDto, senderId: string) {
    try {
      const message = await prisma.message.create({
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
      await prisma.conversation.update({
        where: { id: dto.conversationId },
        data: { lastMessageId: message.id },
      });

      logger.info(
        `Sent message ${message.id} in conversation ${dto.conversationId}`
      );
      return message;
    } catch (err) {
      logger.error("Error sending message:", err);
      throw err;
    }
  }

  async updateConversationLastMessage(
    conversationId: string,
    messageId: string
  ) {
    try {
      const conversation = await prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageId: messageId },
      });

      logger.info(`Updated last message for conversation ${conversationId}`);
      return conversation;
    } catch (err) {
      logger.error("Error updating conversation:", err);
      throw err;
    }
  }
}

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
