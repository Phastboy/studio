
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Post } from '@/types/post';
import {
  getPostsFromStorage,
  addPostToStorage,
  deletePostFromStorage,
  getLikedPostIdsFromStorage,
  saveLikedPostIdsToStorage,
} from '@/lib/postStore';

export function usePostData() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setPosts(getPostsFromStorage());
    setLikedPostIds(getLikedPostIdsFromStorage());
    setIsLoading(false);
  }, []);

  const addPost = useCallback((newPostData: Omit<Post, 'id' | 'createdAt' | 'likeCount'>) => {
    const postWithMetadata: Post = {
      ...newPostData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      likeCount: 0,
    };
    // Note: addPostToStorage in lib now handles setting likeCount to 0 and prepending
    const updatedPosts = addPostToStorage(postWithMetadata); 
    setPosts(updatedPosts);
    return postWithMetadata;
  }, []);

  const deletePost = useCallback((postId: string) => {
    const updatedPosts = deletePostFromStorage(postId);
    setPosts(updatedPosts);
    // Also remove from liked if it was liked
    setLikedPostIds(prevLikedIds => {
      const newLikedIds = new Set(prevLikedIds);
      newLikedIds.delete(postId);
      saveLikedPostIdsToStorage(newLikedIds);
      return newLikedIds;
    });
  }, []);

  const toggleLikePost = useCallback((postId: string) => {
    setPosts(currentPosts => {
      const postIndex = currentPosts.findIndex(p => p.id === postId);
      if (postIndex === -1) return currentPosts;

      const updatedPosts = [...currentPosts];
      const postToUpdate = { ...updatedPosts[postIndex] };
      
      const newLikedPostIds = new Set(likedPostIds);
      if (newLikedPostIds.has(postId)) {
        postToUpdate.likeCount = Math.max(0, postToUpdate.likeCount - 1);
        newLikedPostIds.delete(postId);
      } else {
        postToUpdate.likeCount += 1;
        newLikedPostIds.add(postId);
      }
      
      updatedPosts[postIndex] = postToUpdate;
      savePostsToStorage(updatedPosts); // Save all posts with updated like count
      setLikedPostIds(newLikedPostIds); // Update local state for liked IDs
      saveLikedPostIdsToStorage(newLikedPostIds); // Save liked IDs to storage

      return updatedPosts;
    });
  }, [likedPostIds]);

  const isPostLiked = useCallback((postId: string): boolean => {
    return likedPostIds.has(postId);
  }, [likedPostIds]);

  return {
    posts,
    addPost,
    deletePost,
    toggleLikePost,
    isPostLiked,
    isLoading,
  };
}
