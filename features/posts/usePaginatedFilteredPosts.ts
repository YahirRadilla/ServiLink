import { usePostStore } from "@/entities/posts/store";
import { useEffect, useState } from "react";
import { fetchPostsPage } from "./services";

type Filters = {
    colonia?: string;
    servicio?: string;
    ordenar?: string;
    searchTerm?: string;
};

export const usePaginatedFilteredPosts = (filters: Filters) => {
    const {
        posts,
        setPosts,
        applyFilters,
        filters: activeFilters,
    } = usePostStore();

    const [lastDoc, setLastDoc] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const search = filters.searchTerm?.toLowerCase();

    const filteredPosts = !search
        ? posts
        : posts.filter((post) => {
            return (
                post.title.toLowerCase().includes(search) ||
                post.service.toLowerCase().includes(search) ||
                post.provider.name.toLowerCase().includes(search)
            );
        });

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const { posts: newPosts, last } = await fetchPostsPage(filters as any, lastDoc);

        const all = [...posts, ...newPosts];
        const unique = all.filter(
            (post, index, self) => self.findIndex((p) => p.id === post.id) === index
        );

        setPosts(unique);
        applyFilters(filters, filters.searchTerm);
        setLastDoc(last);
        setHasMore(!!last);
        setLoading(false);
    };

    const refresh = async () => {
        setIsRefreshing(true);
        const { posts: newPosts, last } = await fetchPostsPage(filters as any);

        const unique = newPosts.filter(
            (post, index, self) =>
                self.findIndex((p) => p.id === post.id) === index
        );

        setPosts(unique);
        applyFilters(filters, filters.searchTerm);
        setLastDoc(last);
        setHasMore(!!last);
        setIsRefreshing(false);
    };

    useEffect(() => {
        refresh();
    }, [filters.colonia, filters.servicio, filters.ordenar]);

    return {
        posts: filteredPosts,
        loadMore,
        loading,
        hasMore,
        refresh,
        isRefreshing,
    };
};
