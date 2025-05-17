import { TNotification } from "@/entities/notifications";
import { db } from "@/lib/firebaseConfig";
import { notificationToEntity, RawNotificationData } from "@/mappers/notificationToEntity";
import {
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  getDocs,
  limit, onSnapshot, orderBy,
  query,
  startAfter,
  where
} from "firebase/firestore";

const PAGE_SIZE = 7;

export const listenToNotifications = async (
  userId: string,
  lastVisible?: DocumentSnapshot
): Promise<{
  notifications: TNotification[];
  last: DocumentSnapshot | null;
  hasMore: boolean;
}> => {
  try {
    const notificationsRef = collection(db, "notifications");

    let constraints: any[] = [
      where("user_id", "==", doc(db, "users", userId)),
      orderBy("created_at", "desc"),
      limit(PAGE_SIZE),
    ];

    if (lastVisible) {
      constraints.splice(2, 0, startAfter(lastVisible)); // Inserta justo antes del limit
    }

    const q = query(notificationsRef, ...constraints);
    const snapshot = await getDocs(q);

    const notiPromises = snapshot.docs.map((docSnap) =>
      notificationToEntity(docSnap.id, docSnap.data() as RawNotificationData)
    );

    const notifications = await Promise.all(notiPromises);
    const last = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
    const hasMore = snapshot.docs.length === PAGE_SIZE;

    return { notifications, last, hasMore };
  } catch (error) {
    console.error("🔥 Error al paginar notificaciones:", error);
    return { notifications: [], last: null, hasMore: false };
  }
};

export const listenToNotificationsRealtime = (
  userId: string,
  onUpdate: (notifications: TNotification[]) => void
) => {
  const notificationsRef = collection(db, "notifications");

  const q = query(
    notificationsRef,
    where("user_id", "==", doc(db, "users", userId)),
    orderBy("created_at", "desc")
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    try {
      const notifications = await Promise.all(
        snapshot.docs.map((docSnap) =>
          notificationToEntity(docSnap.id, docSnap.data() as RawNotificationData)
        )
      );

      onUpdate(notifications);
    } catch (err) {
      console.error("❌ Error al mapear notificaciones en tiempo real:", err);
      onUpdate([]); // fallback seguro
    }
  });

  return unsubscribe;
};

export const deleteNotification = async (id: string) => {
  try {
    const ref = doc(db, "notifications", id);
    await deleteDoc(ref);
  } catch (error) {
    console.error(`❌ Error eliminando notificación con ID ${id}:`, error);
    throw error;
  }
};
