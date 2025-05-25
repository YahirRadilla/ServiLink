import { useUserStore } from "@/entities/users"; // asumiendo que ya existe
import { useEffect, useState } from "react";
import { listenUserConversations } from "./service";
import { TConversation } from "./types";

export const useInbox = () => {
    const { user } = useUserStore();
    const [conversations, setConversations] = useState<TConversation[]>([]);

    useEffect(() => {
        if (!user?.id) return;
        const unsub = listenUserConversations(user.id, setConversations);
        return () => unsub();
    }, [user]);

    return { conversations };
};
