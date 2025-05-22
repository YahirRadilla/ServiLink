import { TPost } from "@/entities/posts";
import { useUserStore } from "@/entities/users";
import { db } from "@/lib/firebaseConfig";
import { postToEntity, RawPostData } from "@/mappers/postToEntity";
import { collection, doc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const PAGE_SIZE = 5;

export const usePaginatedPostsByProvider = () => {
    const [posts, setPosts] = useState<TPost[]>([]);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const user = useUserStore((state) => state.user);
    console.log(user);
    const providerId = user?.provider?.id;
    const fetchPosts = async (isRefresh = false) => {
        if (!providerId) return { posts: [], last: null };

        const providerRef = doc(db, "providers", providerId);

        const constraints: any[] = [
            where("provider_id", "==", providerRef),
            orderBy("created_at", "desc"),
            limit(PAGE_SIZE),
        ];

        if (!isRefresh && lastDoc) {
            constraints.push(startAfter(lastDoc));
        }

        const q = query(collection(db, "posts"), ...constraints);
        const snapshot = await getDocs(q);

        const mappedPosts = await Promise.all(
            snapshot.docs.map((doc) =>
                postToEntity(doc.id, doc.data() as RawPostData)
            )
        );

        return {
            posts: mappedPosts,
            last: snapshot.docs[snapshot.docs.length - 1] ?? null,
        };
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
