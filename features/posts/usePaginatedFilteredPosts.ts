import { useEffect, useState } from "react";

import { TPost } from "@/entities/posts";
import { fetchPostsPage } from "./services";

type Filters = {
    colonia?: string;
    servicio?: string;
    ordenar?: string;
    searchTerm?: string;
};

export const usePaginatedFilteredPosts = (filters: Filters) => {
    const [posts, setPosts] = useState<TPost[]>([]);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const search = filters.searchTerm?.toLowerCase();

    const [isRefreshing, setIsRefreshing] = useState(false);


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
        setPosts((prev) => [...prev, ...newPosts]);
        setLastDoc(last);
        setHasMore(!!last);
        setLoading(false);
    };

    const refresh = async () => {
        setIsRefreshing(true);
        const { posts: newPosts, last } = await fetchPostsPage(filters as any);
        setPosts(newPosts);
        setLastDoc(last);
        setHasMore(!!last);
        setIsRefreshing(false);
    };

    useEffect(() => {
        refresh();
    }, [filters.colonia, filters.servicio, filters.ordenar]);

    return { posts: filteredPosts, loadMore, loading, hasMore, refresh, isRefreshing };
};
