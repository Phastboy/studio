
import type { Post } from '@/types/post';
import { mockPosts } from '@/lib/mockData'; // Import mock data

const POSTS_STORAGE_KEY = 'eventide_posts';

export const getPostsFromStorage = (): Post[] => {
  if (typeof window === 'undefined') return [];
  const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
  if (storedPosts) {
    try {
      return JSON.parse(storedPosts);
    } catch (e) {
      console.error("Failed to parse posts from storage, returning empty.", e);
      localStorage.removeItem(POSTS_STORAGE_KEY); // Clear corrupted data
      savePostsToStorage(mockPosts); // Initialize with mock data
      return mockPosts;
    }
  } else {
    // No posts in storage, initialize with mock data
    savePostsToStorage(mockPosts);
    return mockPosts;
  }
};

export const savePostsToStorage = (posts: Post[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
};

export const addPostToStorage = (post: Post): Post[] => {
  const posts = getPostsFromStorage();
  // Add new posts to the top of the feed
  const updatedPosts = [post, ...posts];
  savePostsToStorage(updatedPosts);
  return updatedPosts;
};

export const deletePostFromStorage = (postId: string): Post[] => {
  let posts = getPostsFromStorage();
  posts = posts.filter(post => post.id !== postId);
  savePostsToStorage(posts);
  return posts;
};
