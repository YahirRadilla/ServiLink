import { create } from 'zustand';
import { TPost } from './entity';


type PostState = {
    posts: TPost[];
    filteredPosts: TPost[];
    filters: Record<string, string>;
    setPosts: (posts: TPost[]) => void;
    setFilters: (filters: Record<string, string>) => void;
    applyFilters: (filters: Record<string, string>) => void;
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
    applyFilters: (filters: Record<string, string>) => {
        const posts = get().posts;

        const filtered = posts.filter((post) => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                if (key === "colonia") return post.address.neighborhood === value;
                if (key === "servicio") return post.service === value;
                return true;
            });
        });

        const ordenar = filters.ordenar;

        if (ordenar === "Recientes") {
            filtered.sort((a, b) =>
                (b.createdAt.toDate?.() ?? b.createdAt).getTime() -
                (a.createdAt.toDate?.() ?? a.createdAt).getTime()
            );
        } else if (ordenar === "Más Antigüos") {
            filtered.sort((a, b) =>
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
}));
