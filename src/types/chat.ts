
import type { User } from './user';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string; // ID of the User who sent the message
  text: string;
  timestamp: number; // Unix timestamp
  sender?: User; // Denormalized sender details for easier display (optional)
}

export interface ChatConversation {
  id: string;
  participantIds: string[]; // IDs of Users in the conversation
  // Optional: Store participant details for easier access in UI if needed, though can be looked up
  participants?: Pick<User, 'id' | 'displayName' | 'avatarUrl'>[]; 
  lastMessage?: ChatMessage; // The most recent message in the conversation
  lastMessageAt: number; // Timestamp of the last message, for sorting conversations
  createdAt: number; // Timestamp for when the conversation was created
  // unreadCount?: { [userId: string]: number }; // For future use if we track read status
}
