
import type { Post } from '@/types/post';

const POSTS_STORAGE_KEY = 'eventide_posts';

export const getPostsFromStorage = (): Post[] => {
  if (typeof window === 'undefined') return [];
  const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
  return storedPosts ? JSON.parse(storedPosts) : [];
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
