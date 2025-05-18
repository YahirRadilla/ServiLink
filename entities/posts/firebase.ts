import { TPost } from "@/entities/posts";
import { postToEntity } from "@/mappers/postToEntity";
import { getDoc } from "firebase/firestore";

export const getPostByRef = async (ref: any): Promise<TPost> => {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        throw new Error(`Post no encontrado en la referencia ${ref.path}`);
    }

    return postToEntity(snap.id, snap.data() as any);
};
