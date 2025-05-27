import { usePostStore } from "@/entities/posts";
import { useUserStore } from "@/entities/users";
import { createPost, getPostById, listenToPosts } from "@/features/posts/services";
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

    const getPost = async (id: string) => {
        try {
            setLoading(true);
            const post = await getPostById(id);
            return post;
        } catch (error) {
            console.error("Error al obtener el post desde el hook:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const createNewPost = async (post: any) => {
        const user = useUserStore.getState().user;
        console.log(user);
        try {
            setLoading(true);
            const id = await createPost(post, (user?.provider as any).id || "");
            return id;
        } catch (error) {
            console.error("Error al crear el post desde el hook:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };





    return { loading, createNewPost, getPost };
};


