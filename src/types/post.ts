
export interface Post {
  id: string;
  author: string; 
  content: string;
  createdAt: number; // Timestamp
  likeCount: number; // Number of likes
  // eventId?: string; // Optional: for linking a post to a specific event in the future
}
