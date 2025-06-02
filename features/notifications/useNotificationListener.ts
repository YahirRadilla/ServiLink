import { useUserStore } from "@/entities/users"
import { db } from "@/lib/firebaseConfig"
import * as Notifications from "expo-notifications"
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { useEffect } from "react"

export const useNotificationListener = () => {
    const user = useUserStore((s) => s.user)

    useEffect(() => {
        if (!user?.id) return

        const q = query(
            collection(db, "notifications"),
            where("user_id", "==", doc(db, "users", user.id)),
            where("seen", "==", false)
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                if (change.type === "added") {
                    const notif = change.doc.data()

                    // 🔔 Mostrar notificación local
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: notif.title || "Notificación",
                            body: notif.body || "Tienes una nueva notificación.",
                            data: notif.data || {},
                        },
                        trigger: null, // inmediata
                    })

                    // ✅ Marcar como vista
                    await updateDoc(change.doc.ref, {
                        seen: true
                    })
                }
            })
        })

        return () => unsubscribe()
    }, [user?.id])
}
