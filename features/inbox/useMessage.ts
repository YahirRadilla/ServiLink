import { useEffect, useState } from "react";
import { listenMessages } from "./service";
import { TMessage } from "./types";

export const useMessages = (conversationId: string) => {
    const [messages, setMessages] = useState<TMessage[]>([]);

    useEffect(() => {
        if (!conversationId) return;
        const unsub = listenMessages(conversationId, setMessages);
        return () => unsub();
    }, [conversationId]);

    return { messages };
};
