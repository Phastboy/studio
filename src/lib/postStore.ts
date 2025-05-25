
import type { Post } from '@/types/post';
import { mockPosts } from '@/lib/mockData'; // Import mock data

const POSTS_STORAGE_KEY = 'eventide_posts';
const LIKED_POST_IDS_STORAGE_KEY = 'eventide_liked_post_ids';

export const getPostsFromStorage = (): Post[] => {
  if (typeof window === 'undefined') return [];
  const storedPostsString = localStorage.getItem(POSTS_STORAGE_KEY);
  let posts: Post[] = [];

  if (storedPostsString) {
    try {
      const parsedPosts = JSON.parse(storedPostsString);
      // Ensure all posts have likeCount
      posts = parsedPosts.map((post: any) => ({
        ...post,
        likeCount: post.likeCount === undefined ? 0 : post.likeCount,
      }));
    } catch (e) {
      console.error("Failed to parse posts from storage, will re-initialize.", e);
      // posts remains []
      localStorage.removeItem(POSTS_STORAGE_KEY); // Clear corrupted data
    }
  }

  if (!storedPostsString && mockPosts.length > 0) { // Reverted: check !storedPostsString
    console.log("Local storage for posts is empty or invalid, initializing with mock posts.");
    // Ensure mock posts also have likeCount initialized if not present in mockData definition
    const postsWithLikes = mockPosts.map(post => ({ ...post, likeCount: post.likeCount || 0 }));
    savePostsToStorage(postsWithLikes);
    return [...postsWithLikes]; // Return a copy
  }

  return posts;
};

export const savePostsToStorage = (posts: Post[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
};

export const addPostToStorage = (post: Omit<Post, 'id' | 'createdAt' | 'likeCount'> & { id: string; createdAt: number }): Post[] => {
  const posts = getPostsFromStorage();
  const newPostWithLike: Post = {
    ...post,
    likeCount: 0, 
  };
  // Ensure no duplicates if mock data was just loaded and then an add is attempted with a mock id
  const postExists = posts.some(p => p.id === newPostWithLike.id);
  const updatedPosts = postExists ? posts : [newPostWithLike, ...posts];
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
    localStorage.removeItem(LIKED_POST_IDS_STORAGE_KEY); // Clear corrupted data
    return new Set();
  }
};

export const saveLikedPostIdsToStorage = (ids: Set<string>): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LIKED_POST_IDS_STORAGE_KEY, JSON.stringify(Array.from(ids)));
};

