import { usePostStore } from "@/entities/posts";
import { listenToPosts } from "@/features/posts/services";
import { useEffect, useState } from "react";

export const usePosts = () => {
    const setPosts = usePostStore((state) => state.setPosts);
    const clearPosts = usePostStore((state) => state.clearPosts);
    const filters = usePostStore((state) => state.filters);
    const applyFilters = usePostStore((state) => state.applyFilters);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = listenToPosts((newPosts) => {
            setPosts(newPosts);
            applyFilters(filters);
            setLoading(false);
        });

        return () => {
            unsubscribe();
            clearPosts();
        };
    }, []);

    return { loading };
};
