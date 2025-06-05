import { TPost } from "@/entities/posts";
import { useUserStore } from "@/entities/users";
import { db } from "@/lib/firebaseConfig";
import { postToEntity, RawPostData } from "@/mappers/postToEntity";
import {
    collection,
    doc,
    DocumentSnapshot,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    where
} from "firebase/firestore";
import { useEffect, useState } from "react";

export const usePaginatedPostsByProvider = () => {
    const [posts, setPosts] = useState<TPost[]>([]);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const user = useUserStore((state) => state.user);
    const providerId = user?.provider?.id;

    const POSTS_LIMIT = 5;

    const fetchInitialPosts = async () => {
        if (!providerId) return;

        setLoading(true);
        const q = query(
            collection(db, "posts"),
            where("provider_id", "==", doc(db, "providers", providerId)),
            orderBy("created_at", "desc"),
            limit(POSTS_LIMIT)
        );

        const snapshot = await getDocs(q);
        const newPosts = await Promise.all(
            snapshot.docs.map((doc) =>
                postToEntity(doc.id, doc.data() as RawPostData)
            )
        );

        setPosts(newPosts);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1] ?? null);
        setHasMore(snapshot.docs.length === POSTS_LIMIT);
        setLoading(false);
    };

    useEffect(() => {
        fetchInitialPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providerId]);

    const loadMore = async () => {
        if (loading || !hasMore || !providerId || !lastDoc) return;

        setLoading(true);
        const q = query(
            collection(db, "posts"),
            where("provider_id", "==", doc(db, "providers", providerId)),
            orderBy("created_at", "desc"),
            startAfter(lastDoc),
            limit(POSTS_LIMIT)
        );

        const snapshot = await getDocs(q);
        const newPosts = await Promise.all(
            snapshot.docs.map((doc) =>
                postToEntity(doc.id, doc.data() as RawPostData)
            )
        );

        setPosts((prev) => {
            const all = [...prev, ...newPosts];
            const unique = all.filter(
                (post, index, self) =>
                    self.findIndex((p) => p.id === post.id) === index
            );
            return unique;
        });

        setLastDoc(snapshot.docs[snapshot.docs.length - 1] ?? null);
        setHasMore(snapshot.docs.length === POSTS_LIMIT);
        setLoading(false);
    };

    const refresh = async () => {
        if (!providerId) return;

        setIsRefreshing(true);
        await fetchInitialPosts();
        setIsRefreshing(false);
    };

    return {
        posts,
        loadMore,
        refresh,
        loading,
        hasMore,
        isRefreshing,
    };
};
