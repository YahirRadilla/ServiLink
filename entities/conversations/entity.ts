
import { TUser } from "@/entities/users";
import { DocumentReference } from "firebase/firestore";

export type TConversationEntity = {
    id: string;
    lastMessage: string;
    userRef: DocumentReference;
    user: TUser;
};
