import { create } from 'zustand';
import { TPost } from './entity';


type PostState = {
    posts: TPost[];
    filteredPosts: TPost[];
    filters: Record<string, string>;
    setPosts: (posts: TPost[]) => void;
    setFilters: (filters: Record<string, string>) => void;
    applyFilters: (filters: any, searchTerm?: string) => void;
    clearPosts: () => void;
    resetFilters: () => void;
};

export const usePostStore = create<PostState>((set, get) => ({
    posts: [],
    filteredPosts: [],
    filters: {},
    setPosts: (posts) =>
        set({ posts }, false),
    setFilters: (filters) => set({ filters }, false),
    applyFilters: (filters: any, searchTerm?: string) => {
        const posts = get().posts;

        let filtered = posts.filter((post) => {
            const matchesFilters = Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                if (key === "neighborhood") return post.address.neighborhood === value;
                if (key === "service") return post.service === value;
                return true;
            });

            const matchesSearch =
                !searchTerm ||
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.provider.name.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesFilters && matchesSearch;
        });

        const order = filters.order;
        if (order === "Recientes") {
            filtered.sort(
                (a, b) =>
                    (b.createdAt.toDate?.() ?? b.createdAt).getTime() -
                    (a.createdAt.toDate?.() ?? a.createdAt).getTime()
            );
        } else if (order === "Más Antigüos") {
            filtered.sort(
                (a, b) =>
                    (a.createdAt.toDate?.() ?? a.createdAt).getTime() -
                    (b.createdAt.toDate?.() ?? b.createdAt).getTime()
            );
        }

        set({ filteredPosts: filtered, filters });
    },

    clearPosts: () => set({ posts: [], filteredPosts: [] }, false),
    resetFilters: () => set({
        filters: {
            neighborhood: "",
            service: "",
            order: "",
        },
        filteredPosts: get().posts,
    }),
}));
