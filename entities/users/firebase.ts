import { TUser } from "@/entities/users";
import { mapFirestoreUserToTUser } from "@/mappers/firebaseAuthToUser";
import { getDoc } from "firebase/firestore";

export const getUserByRef = async (ref: any): Promise<TUser> => {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        throw new Error(`Usuario no encontrado en la referencia ${ref.path}`);
    }

    return mapFirestoreUserToTUser({ id: snap.id, ...snap.data() as any });
};
