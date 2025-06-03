import { TConversationEntity } from "@/entities/conversations";
import { useUserStore } from "@/entities/users"; // asumiendo que ya existe
import { useEffect, useState } from "react";
import { listenUserConversations } from "./service";

export const useInbox = () => {
    const { user } = useUserStore();
    const [conversations, setConversations] = useState<TConversationEntity[]>([]);


    useEffect(() => {
        if (!user?.id || !user?.profileStatus) return;

        const unsub = listenUserConversations(user.id, user.profileStatus, setConversations);

        return () => unsub();
    }, [user]);

    return { conversations };
};

