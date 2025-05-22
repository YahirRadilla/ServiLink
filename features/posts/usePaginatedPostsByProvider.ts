import { TPost } from "@/entities/posts";
import { useUserStore } from "@/entities/users";
import { getPostsByProviderRef } from "@/features/posts/services";
import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export const usePaginatedPostsByProvider = () => {
    const [posts, setPosts] = useState<TPost[]>([]);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const user = useUserStore((state) => state.user);
    const providerId = user?.provider?.id;

    const fetchPosts = async (isRefresh = false) => {
        if (!providerId) return { posts: [], last: null };

        const result = await getPostsByProviderRef(
            providerId,
            isRefresh ? undefined : lastDoc ?? undefined
        );

        return result;
    };

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        const { posts: newPosts, last } = await fetchPosts();
        setPosts((prev) => {
            const all = [...prev, ...newPosts];
            const unique = all.filter(
                (post, index, self) => self.findIndex((p) => p.id === post.id) === index
            );
            return unique;
        });

        setLastDoc(last);
        setHasMore(!!last);
        setLoading(false);
    };

    const refresh = async () => {
        if (!providerId) return;
        setIsRefreshing(true);

        const { posts: newPosts, last } = await fetchPosts(true);

        setPosts(newPosts);
        setLastDoc(last);
        setHasMore(!!last);
        setIsRefreshing(false);
    };

    useEffect(() => {
        refresh();
    }, [providerId]);

    return {
        posts,
        loadMore,
        refresh,
        loading,
        hasMore,
        isRefreshing,
    };
};
