
export interface Post {
  id: string;
  author: string; 
  content: string;
  createdAt: number; // Timestamp
  // eventId?: string; // Optional: for linking a post to a specific event in the future
}
