
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Comment } from '@/types/comment';
import {
  getCommentsFromStorage,
  addCommentToStorage,
  deleteCommentFromStorage,
  getCommentsForPostFromStorage,
} from '@/lib/commentStore';

export function useCommentData() {
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAllComments(getCommentsFromStorage());
    setIsLoading(false);
  }, []);

  const addComment = useCallback((newCommentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const commentWithMetadata: Comment = {
      ...newCommentData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    const updatedComments = addCommentToStorage(commentWithMetadata);
    setAllComments(updatedComments);
    return commentWithMetadata;
  }, []);

  const deleteComment = useCallback((commentId: string) => {
    const updatedComments = deleteCommentFromStorage(commentId);
    setAllComments(updatedComments);
  }, []);

  const getCommentsByPostId = useCallback((postId: string) => {
    return allComments.filter(comment => comment.postId === postId).sort((a,b) => a.createdAt - b.createdAt);
  }, [allComments]);

  return {
    allComments,
    addComment,
    deleteComment,
    getCommentsByPostId,
    isLoading,
  };
}
