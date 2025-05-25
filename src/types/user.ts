
export interface User {
  id: string;
  displayName: string;
  email?: string; 
  avatarUrl?: string; // URL to a profile picture
  createdAt: number; // Timestamp
}

// Added to easily pass around partial user info for chat participants/senders
export type ChatParticipant = Pick<User, 'id' | 'displayName' | 'avatarUrl'>;
