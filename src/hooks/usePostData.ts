
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Post } from '@/types/post';
import {
  getPostsFromStorage,
  addPostToStorage,
  deletePostFromStorage,
} from '@/lib/postStore';

export function usePostData() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPosts(getPostsFromStorage());
    setIsLoading(false);
  }, []);

  const addPost = useCallback((newPostData: Omit<Post, 'id' | 'createdAt'>) => {
    const postWithMetadata: Post = {
      ...newPostData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    const updatedPosts = addPostToStorage(postWithMetadata);
    setPosts(updatedPosts);
    return postWithMetadata;
  }, []);

  const deletePost = useCallback((postId: string) => {
    const updatedPosts = deletePostFromStorage(postId);
    setPosts(updatedPosts);
  }, []);

  return {
    posts,
    addPost,
    deletePost,
    isLoading,
  };
}
