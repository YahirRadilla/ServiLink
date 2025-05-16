import { TNotification } from "@/entities/notifications";
import { db } from "@/lib/firebaseConfig";
import {
    notificationToEntity,
    RawNotificationData,
} from "@/mappers/notificationToEntity";
import { collection, onSnapshot } from "firebase/firestore";

export const listenToNotifications = (
  onUpdate: (notifications: TNotification[]) => void
) => {
  const notificationsRef = collection(db, "notifications");

  const unsubscribe = onSnapshot(notificationsRef, async (snapshot) => {
    try {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }

      const notificationsPromises = snapshot.docs.map(async (doc) => {
        try {
          const data = doc.data();
          if (!data || typeof data !== "object")
            throw new Error("Documento inválido");

          const noti = await notificationToEntity(
            doc.id,
            data as RawNotificationData
          );
          return noti;
        } catch (err: any) {
          console.warn(
            `⚠️ Error al procesar notificación ${doc.id}:`,
            err.message
          );
          return null;
        }
      });

      const results = await Promise.all(notificationsPromises);
      const validNotifications = results.filter(Boolean) as TNotification[];

      onUpdate(validNotifications);
    } catch (error) {
    }
  });

  return unsubscribe;
};
