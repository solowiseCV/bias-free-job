export interface CreateConversationDto {
  participantIds: string[];
}

export interface SendMessageDto {
  conversationId: string;
  content: string;
}
