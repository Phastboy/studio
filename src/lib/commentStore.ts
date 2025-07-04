
import type { Comment } from '@/types/comment';
import { mockComments } from '@/lib/mockData';

const COMMENTS_STORAGE_KEY = 'eventide_comments';

export const getCommentsFromStorage = (): Comment[] => {
  if (typeof window === 'undefined') return [];
  const storedCommentsString = localStorage.getItem(COMMENTS_STORAGE_KEY);
  let comments: Comment[] = [];

  if (storedCommentsString) {
    try {
      comments = JSON.parse(storedCommentsString);
    } catch (e) {
      console.error("Failed to parse comments from storage, will re-initialize.", e);
      // comments remains []
      localStorage.removeItem(COMMENTS_STORAGE_KEY); // Clear corrupted data
    }
  }

  if (!storedCommentsString && mockComments.length > 0) { // Reverted: check !storedCommentsString
    console.log("Local storage for comments is empty or invalid, initializing with mock comments.");
    saveCommentsToStorage(mockComments);
    return [...mockComments]; // Return a copy
  }
  
  return comments;
};

export const saveCommentsToStorage = (comments: Comment[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
};

export const addCommentToStorage = (comment: Comment): Comment[] => {
  const comments = getCommentsFromStorage();
  // Ensure no duplicates if mock data was just loaded and then an add is attempted with a mock id
  const commentExists = comments.some(c => c.id === comment.id);
  const updatedComments = commentExists ? comments : [...comments, comment].sort((a,b) => a.createdAt - b.createdAt); 
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
    if (commentsToDelete.size === initialSize && !changed) break; 
  }
  
  comments = comments.filter(comment => !commentsToDelete.has(comment.id));
  saveCommentsToStorage(comments);
  return comments;
};

export const getCommentsForPostFromStorage = (postId: string): Comment[] => {
  const allComments = getCommentsFromStorage();
  return allComments.filter(comment => comment.postId === postId);
};

