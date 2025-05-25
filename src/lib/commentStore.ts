
import type { Comment } from '@/types/comment';
import { mockComments } from '@/lib/mockData';

const COMMENTS_STORAGE_KEY = 'eventide_comments';

export const getCommentsFromStorage = (): Comment[] => {
  if (typeof window === 'undefined') return [];
  const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
  if (storedComments) {
    try {
      return JSON.parse(storedComments);
    } catch (e) {
      console.error("Failed to parse comments from storage, initializing with mock.", e);
      localStorage.removeItem(COMMENTS_STORAGE_KEY);
      saveCommentsToStorage(mockComments); // Initialize with mock data on error
      return mockComments;
    }
  } else {
    // No comments in storage, initialize with mock data
    saveCommentsToStorage(mockComments);
    return mockComments;
  }
};

export const saveCommentsToStorage = (comments: Comment[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
};

export const addCommentToStorage = (comment: Comment): Comment[] => {
  const comments = getCommentsFromStorage();
  const updatedComments = [...comments, comment].sort((a,b) => a.createdAt - b.createdAt); // Sort by oldest first
  saveCommentsToStorage(updatedComments);
  return updatedComments;
};

export const deleteCommentFromStorage = (commentId: string): Comment[] => {
  let comments = getCommentsFromStorage();
  // Also delete all replies to this comment
  const commentsToDelete = new Set<string>([commentId]);
  let changed = true;
  while(changed) {
    changed = false;
    const initialSize = commentsToDelete.size;
    comments.forEach(c => {
      if(c.parentId && commentsToDelete.has(c.parentId) && !commentsToDelete.has(c.id)) {
        commentsToDelete.add(c.id);
        changed = true;
      }
    });
    if (commentsToDelete.size === initialSize && !changed) break; // break if no new replies found in an iteration
  }
  
  comments = comments.filter(comment => !commentsToDelete.has(comment.id));
  saveCommentsToStorage(comments);
  return comments;
};

export const getCommentsForPostFromStorage = (postId: string): Comment[] => {
  const allComments = getCommentsFromStorage();
  return allComments.filter(comment => comment.postId === postId);
};
