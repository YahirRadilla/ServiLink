import { TConversationEntity } from "@/entities/conversations";
import { db } from "@/lib/firebaseConfig";
import { conversationToEntity } from "@/mappers/conversationToEntity";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { TMessage } from "./types";

// Obtiene las conversaciones donde participa un usuario
export const listenUserConversations = (
    userId: string,
    profileStatus: string,
    callback: (data: TConversationEntity[]) => void
) => {
    const userRef = doc(db, "users", userId);

    const q = query(
        collection(db, "conversations"),
        where(profileStatus === "client" ? "client_id" : "provider_id", "==", userRef)
    );

    return onSnapshot(q, async (snap) => {
        const promises = snap.docs.map((docSnap) =>
            conversationToEntity(docSnap, userId)
        );

        const enriched = await Promise.all(promises);
        callback(enriched);
    });
};

// Escucha mensajes de una conversación
export const listenMessages = (
    conversationId: string,
    callback: (data: TMessage[]) => void
) => {
    const q = query(
        collection(db, "messages"),
        where("conversation_id", "==", doc(db, "conversations", conversationId)),
        orderBy("date", "desc"),
        limit(20)
    );

    return onSnapshot(q, (snap) => {
        const result = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as TMessage[];
        callback(result); // ordenar ascendente
    });
};

// Enviar mensaje
export const sendMessage = async (message: Omit<TMessage, "id" | "date">) => {
    await addDoc(collection(db, "messages"), {
        ...message,
        date: serverTimestamp(),
    });
    let lastMessage = message.type === "text" ? message.content : message.type === "video" ? "📹 Video" : "📷 Foto";
    // Actualizar último mensaje en conversación
    await updateLastMessage(message.conversation_id.id, lastMessage);
};

const updateLastMessage = async (conversationId: string, lastMessage: string) => {
    const convRef = doc(db, "conversations", conversationId);
    await updateDoc(convRef, { last_message: lastMessage });
};


export const createConversationIfNotExists = async (
    clientId: string,
    providerId: string
): Promise<string> => {
    const clientRef = doc(db, "users", clientId);
    const providerRef = doc(db, "users", providerId);

    const q = query(
        collection(db, "conversations"),
        where("client_id", "==", clientRef),
        where("provider_id", "==", providerRef)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        // Ya existe
        return snapshot.docs[0].id;
    }

    // Si no existe, la creamos
    const newConv = await addDoc(collection(db, "conversations"), {
        client_id: clientRef,
        provider_id: providerRef,
        last_message: "",
        created_at: serverTimestamp(),
    });

    return newConv.id;
};