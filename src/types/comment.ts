
export interface Comment {
  id: string;
  postId: string; // ID of the post this comment belongs to
  parentId?: string | null; // ID of the parent comment if this is a reply
  author: string; // Name of the commenter
  content: string;
  createdAt: number; // Timestamp
}
