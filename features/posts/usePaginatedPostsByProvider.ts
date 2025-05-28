import { TPost } from "@/entities/posts";
import { useUserStore } from "@/entities/users";
import { db } from "@/lib/firebaseConfig";
import { postToEntity, RawPostData } from "@/mappers/postToEntity";
import { collection, doc, DocumentSnapshot, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getPostsByProviderRef } from "./services";

export const usePaginatedPostsByProvider = () => {
    const [posts, setPosts] = useState<TPost[]>([]);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const user = useUserStore((state) => state.user);
    const providerId = user?.provider?.id;

    useEffect(() => {
        if (!providerId) return;
        const q = query(
            collection(db, "posts"),
            where("provider_id", "==", doc(db, "providers", providerId)),
            orderBy("created_at", "desc")
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const postPromises = snapshot.docs.map((doc) =>
                postToEntity(doc.id, doc.data() as RawPostData)
            );
            const posts = await Promise.all(postPromises);
            setPosts(posts);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] ?? null);
            setHasMore(!!snapshot.docs.length);
        });

        return () => unsubscribe();
    }, [providerId]);

    const loadMore = async () => {
        if (loading || !hasMore || !providerId) return;
        setLoading(true);

        const { posts: newPosts, last } = await getPostsByProviderRef(providerId, lastDoc ?? undefined);
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

        const { posts: newPosts, last } = await getPostsByProviderRef(providerId, undefined);

        setPosts(newPosts);
        setLastDoc(last);
        setHasMore(!!last);
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
