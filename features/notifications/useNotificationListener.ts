import { useUserStore } from "@/entities/users";
import { db } from "@/lib/firebaseConfig";
import { useToastStore } from "@/shared/toastStore";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect } from "react";

export const useNotificationListener = () => {
    const user = useUserStore((s) => s.user);
    const toast = useToastStore((s) => s.toastRef);

    useEffect(() => {
        if (!user?.id) return;
        const q = query(
            collection(db, "notifications"),
            where("user_id", "==", doc(db, "users", user.id)),
            where("seen", "==", false)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const notif = change.doc.data();
                    toast?.show(notif.title || "Notificación", "info", 3000);

                }
            });
        });

        return () => unsubscribe();
    }, [user?.id]);
};
