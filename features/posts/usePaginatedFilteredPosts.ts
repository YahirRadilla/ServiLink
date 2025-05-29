import { db } from "@/lib/firebaseConfig";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

import { TPost } from "@/entities/posts";
import { postToEntity, RawPostData } from "@/mappers/postToEntity";
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

    useEffect(() => {
        let constraints: any[] = [orderBy("created_at", "desc")];

        if (filters.colonia) {
            constraints.push(where("address.neighborhood", "==", filters.colonia));
        }
        if (filters.servicio) {
            constraints.push(where("service", "==", filters.servicio));
        }

        const q = query(collection(db, "posts"), ...constraints);

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
    }, [filters.colonia, filters.servicio, filters.ordenar]);

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

        setPosts((prev) => {
            const all = [...prev, ...newPosts];
            const unique = all.filter(
                (post, index, self) =>
                    self.findIndex((p) => p.id === post.id) === index
            );
            return unique;
        });

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
        setLastDoc(last);
        setHasMore(!!last);
        setIsRefreshing(false);
    };


    return { posts: filteredPosts, loadMore, loading, hasMore, refresh, isRefreshing };
};
