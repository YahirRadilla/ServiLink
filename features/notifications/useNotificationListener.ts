import { useUserStore } from "@/entities/users";
import { db } from "@/lib/firebaseConfig";
import * as Notifications from "expo-notifications";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect } from "react";
import { Platform } from "react-native";

export const useNotificationListener = () => {
    const user = useUserStore((s) => s.user);

    useEffect(() => {
        if (!user?.id) return;


        const setupNotificationChannel = async () => {
            if (Platform.OS === "android") {
                await Notifications.setNotificationChannelAsync("default", {
                    name: "default",
                    importance: Notifications.AndroidImportance.HIGH,
                    sound: "default",
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: "#FF231F7C",
                });
            }
        };

        setupNotificationChannel();

        const q = query(
            collection(db, "notifications"),
            where("user_id", "==", doc(db, "users", user.id)),
            where("seen", "==", false)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                if (change.type === "added") {
                    const notif = change.doc.data();


                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: notif.title || "Notificación",
                            body: notif.body || "Tienes una nueva notificación.",
                            data: notif.data || {},
                            sound: "default",
                        },
                        trigger: Platform.OS === "android" ? { seconds: 1, channelId: "default" } : null,
                    });


                    await updateDoc(change.doc.ref, {
                        seen: true,
                    });
                }
            });
        });

        return () => unsubscribe();
    }, [user?.id]);
};
