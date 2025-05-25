import { DocumentReference, Timestamp } from "firebase/firestore";

export type TConversation = {
    id: string;
    client_id: DocumentReference;
    provider_id: DocumentReference;
    last_message: string;
};

export type TMessage = {
    id: string;
    sender_id: DocumentReference;
    conversation_id: DocumentReference;
    type: "image" | "text" | "video";
    content: string;
    seen: boolean;
    date: Timestamp;
};
