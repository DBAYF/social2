import { create } from 'zustand';

interface Post {
  id: string;
  author: {
    id: string;
    username: string;
    fullname: string;
    profilePicture?: string;
  };
  content: string;
  images?: string[];
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface FeedState {
  posts: Post[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;

  // Actions
  setPosts: (posts: Post[]) => void;
  addPosts: (posts: Post[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleLike: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  removePost: (postId: string) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  loading: false,
  hasMore: true,
  error: null,

  setPosts: (posts) => set({ posts, error: null }),

  addPosts: (newPosts) => set((state) => ({
    posts: [...state.posts, ...newPosts]
  })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  toggleLike: (postId) => set((state) => ({
    posts: state.posts.map(post =>
      post.id === postId
        ? {
            ...post,
            isLiked: !post.isLiked,
            likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
          }
        : post
    )
  })),

  toggleBookmark: (postId) => set((state) => ({
    posts: state.posts.map(post =>
      post.id === postId
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    )
  })),

  updatePost: (postId, updates) => set((state) => ({
    posts: state.posts.map(post =>
      post.id === postId ? { ...post, ...updates } : post
    )
  })),

  removePost: (postId) => set((state) => ({
    posts: state.posts.filter(post => post.id !== postId)
  })),
}));