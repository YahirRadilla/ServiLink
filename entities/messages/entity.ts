import { DocumentReference, Timestamp } from "firebase/firestore";


export type TTypeMessage = 'text' | 'image' | 'video';

export type TMessage = {
  id: string;
  senderId: DocumentReference;
  conversationId: DocumentReference;
  type: "image" | "text" | "video";
  content: string;
  seen: boolean;
  date: Timestamp;
};


