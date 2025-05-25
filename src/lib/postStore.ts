
import type { Post } from '@/types/post';
import { mockPosts } from '@/lib/mockData'; // Import mock data

const POSTS_STORAGE_KEY = 'eventide_posts';
const LIKED_POST_IDS_STORAGE_KEY = 'eventide_liked_post_ids';

export const getPostsFromStorage = (): Post[] => {
  if (typeof window === 'undefined') return [];
  const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
  if (storedPosts) {
    try {
      // Ensure all posts have likeCount, defaulting to 0 if missing
      return JSON.parse(storedPosts).map((post: any) => ({
        ...post,
        likeCount: post.likeCount === undefined ? 0 : post.likeCount,
      }));
    } catch (e) {
      console.error("Failed to parse posts from storage, initializing with mock.", e);
      localStorage.removeItem(POSTS_STORAGE_KEY); 
      const postsWithLikes = mockPosts.map(post => ({ ...post, likeCount: post.likeCount || 0 }));
      savePostsToStorage(postsWithLikes); 
      return postsWithLikes;
    }
  } else {
    const postsWithLikes = mockPosts.map(post => ({ ...post, likeCount: post.likeCount || 0 }));
    savePostsToStorage(postsWithLikes);
    return postsWithLikes;
  }
};

export const savePostsToStorage = (posts: Post[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
};

export const addPostToStorage = (post: Omit<Post, 'id' | 'createdAt' | 'likeCount'> & { id: string; createdAt: number }): Post[] => {
  const posts = getPostsFromStorage();
  const newPostWithLike: Post = {
    ...post,
    likeCount: 0, // New posts start with 0 likes
  };
  const updatedPosts = [newPostWithLike, ...posts];
  savePostsToStorage(updatedPosts);
  return updatedPosts;
};

export const deletePostFromStorage = (postId: string): Post[] => {
  let posts = getPostsFromStorage();
  posts = posts.filter(post => post.id !== postId);
  savePostsToStorage(posts);
  return posts;
};

// --- Liked Post IDs Management ---
export const getLikedPostIdsFromStorage = (): Set<string> => {
  if (typeof window === 'undefined') return new Set();
  const storedLikedIds = localStorage.getItem(LIKED_POST_IDS_STORAGE_KEY);
  try {
    return storedLikedIds ? new Set(JSON.parse(storedLikedIds)) : new Set();
  } catch (e) {
    console.error("Failed to parse liked post IDs from storage", e);
    return new Set();
  }
};

export const saveLikedPostIdsToStorage = (ids: Set<string>): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LIKED_POST_IDS_STORAGE_KEY, JSON.stringify(Array.from(ids)));
};
