import { mapFirestoreUserToTUser } from "@/mappers/firebaseAuthToUser";
import { DocumentSnapshot, getDoc } from "firebase/firestore";
import { TConversationEntity } from "../entities/conversations";

export const conversationToEntity = async (
    docSnap: DocumentSnapshot,
    currentUserId: string
): Promise<TConversationEntity> => {
    const data = docSnap.data();
    const id = docSnap.id;

    const clientRef = data!.client_id;
    const providerRef = data!.provider_id;

    const isClient = clientRef.id === currentUserId;
    const otherUserRef = isClient ? providerRef : clientRef;
    const otherUserSnap = await getDoc(otherUserRef);

    const otherUser = mapFirestoreUserToTUser(otherUserSnap.data());


    return {
        id,
        lastMessage: data!.last_message,
        userRef: otherUserRef,
        user: otherUser,
    };
};
