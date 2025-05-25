
export interface User {
  id: string;
  displayName: string;
  email?: string; 
  avatarUrl?: string; // URL to a profile picture
  createdAt: number; // Timestamp
}
