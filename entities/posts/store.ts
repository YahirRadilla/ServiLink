import { create } from 'zustand';
import { TPost } from './entity';

type PostState = {
    posts: TPost[];
    addPost: (post: TPost) => void;
    setPosts: (posts: TPost[]) => void;
    clearPosts: () => void;
};

export const usePostStore = create<PostState>((set, get) => ({
    posts: [],
    addPost: (post: TPost) => set({ posts: [...get().posts, post] }),
    setPosts: (posts) => set({ posts }),
    clearPosts: () => set({ posts: [] }),
}))