import { TNotification } from "@/entities/notifications";
import { db } from "@/lib/firebaseConfig";
import { notificationToEntity, RawNotificationData } from "@/mappers/notificationToEntity";
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

      const notificationsPromises = snapshot.docs.map((doc) =>
        notificationToEntity(doc.id, doc.data() as RawNotificationData)
      );

      const notifications = await Promise.all(notificationsPromises);
      onUpdate(notifications);
    } catch (error) {
    }
  });

  return unsubscribe;
};
