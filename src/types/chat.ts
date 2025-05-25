
import type { ChatParticipant } from './user';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string; // ID of the User who sent the message
  text: string;
  timestamp: number; // Unix timestamp
  sender?: ChatParticipant; // Denormalized sender details for easier display
}

export interface ChatConversation {
  id: string;
  participantIds: string[]; // IDs of Users in the conversation
  participants: ChatParticipant[]; 
  lastMessage?: ChatMessage; // The most recent message in the conversation
  lastMessageAt: number; // Timestamp of the last message, for sorting conversations
  createdAt: number; // Timestamp for when the conversation was created
  // unreadCount?: { [userId: string]: number }; // For future use if we track read status
}
