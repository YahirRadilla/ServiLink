import { TPost } from "@/entities/posts";
import { useUserStore } from "@/entities/users";
import { db } from "@/lib/firebaseConfig";
import { postToEntity, RawPostData } from "@/mappers/postToEntity";
import {
    collection,
    doc,
    DocumentData,
    onSnapshot,
    orderBy,
    query,
    QuerySnapshot,
    where
} from "firebase/firestore";
import { useEffect, useState } from "react";

export const usePaginatedPostsByProvider = () => {
    const [posts, setPosts] = useState<TPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const user = useUserStore((state) => state.user);
    const providerId = user?.provider?.id;

    useEffect(() => {
        if (!providerId) return;

        setLoading(true);

        const q = query(
            collection(db, "posts"),
            where("provider_id", "==", doc(db, "providers", providerId)),
            orderBy("created_at", "desc")
        );

        const unsubscribe = onSnapshot(
            q,
            async (snapshot: QuerySnapshot<DocumentData>) => {
                const updatedPosts = await Promise.all(
                    snapshot.docs.map((doc) =>
                        postToEntity(doc.id, doc.data() as RawPostData)
                    )
                );
                setPosts(updatedPosts);
                setLoading(false);
            },
            (error) => {
                console.error("❌ Error en onSnapshot:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [providerId]);

    const refresh = async () => {
        setIsRefreshing(true);

        setIsRefreshing(false);
    };

    const removePostLocally = (postId: string) => {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
    };

    return {
        posts,
        refresh,
        loading,
        isRefreshing,
        removePostLocally
    };
};
