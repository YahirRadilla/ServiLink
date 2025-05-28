import { create } from 'zustand';
import { TPost } from './entity';


type PostState = {
    posts: TPost[];
    currentPost: TPost | null;
    filteredPosts: TPost[];
    filters: Record<string, string>;
    setPosts: (posts: TPost[]) => void;
    setCurrentPost: (post: TPost) => void;
    setFilters: (filters: Record<string, string>) => void;
    applyFilters: (filters: any, searchTerm?: string) => void;
    clearPosts: () => void;
    resetFilters: () => void;
    getProviderByPostId: (id: string) => string | null;
    disablePostLocally: (id: string) => void;
};

export const usePostStore = create<PostState>((set, get) => ({
    posts: [],
    currentPost: null,
    filteredPosts: [],
    filters: {},
    setPosts: (posts) =>
        set({ posts }, false),
    setCurrentPost: (post) =>
        set({ currentPost: post }, false),
    setFilters: (filters) => set({ filters }, false),
    applyFilters: (filters: any, searchTerm?: string) => {
        const posts = get().posts;

        let filtered = posts.filter((post) => {
            const matchesFilters = Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                if (key === "colonia") return post.address.neighborhood === value;
                if (key === "servicio") return post.service === value;
                return true;
            });

            const matchesSearch =
                !searchTerm ||
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.provider.name.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesFilters && matchesSearch;
        });

        const ordenar = filters.ordenar;
        if (ordenar === "Recientes") {
            filtered.sort(
                (a, b) =>
                    (b.createdAt.toDate?.() ?? b.createdAt).getTime() -
                    (a.createdAt.toDate?.() ?? a.createdAt).getTime()
            );
        } else if (ordenar === "Más Antigüos") {
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
            colonia: "",
            servicio: "",
            ordenar: "",
        },
        filteredPosts: get().posts,
    }),
    getProviderByPostId: (id) => {
        const post = get().posts.find((post) => post.id === id);
        return post ? post.provider.id : null;
    },


    disablePostLocally: (id: string) =>
        set((state) => ({
            posts: state.posts.map((post) =>
                post.id === id ? { ...post, status: false } : post
            ),
            filteredPosts: state.filteredPosts.map((post) =>
                post.id === id ? { ...post, status: false } : post
            ),
        })),
}));
