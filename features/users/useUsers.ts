import { useUserStore } from "@/entities/users/store";
import { listenToUserChanges } from "./services";

let unsubscribe: (() => void) | null = null;

export const useUserListener = (userId: string | null) => {
    const setUser = useUserStore((state) => state.setUser);
    const clearUser = useUserStore((state) => state.clearUser);

    if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
    }

    if (userId) {
    unsubscribe = listenToUserChanges(userId, setUser);
    } else {
    clearUser();
    }
};
