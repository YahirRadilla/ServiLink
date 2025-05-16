import { TNotification } from "@/entities/notifications";
import { db } from "@/lib/firebaseConfig";
import { collection, getDoc, query, where } from "firebase/firestore";

export type RawNotificationData = {
  title: string;
  content?: string;
  type: TNotification["type"];
  date: string;
  seen?: boolean;
  user_id: any;
};

export async function notificationToEntity(
  id: string,
  data: RawNotificationData
): Promise<TNotification> {
  const userRef = await getDoc(data.user_id);
  if (!userRef.exists()) throw new Error("Usuario no encontrado");

  const usersRef = collection(db, "users");
  const qUser = query(usersRef, where("user_id", "==", data.user_id));
  const userSnap = await getDoc(data.user_id);
  if (!userSnap.exists()) throw new Error("Usuario no encontrado");

  const userData = userSnap.data() as any;

  return {
    id,
    title: data.title,
    content: data.content ?? "Sin contenido",
    type: data.type,
    seen: data.seen ?? false,
    user: userData,
    userType: userData.profileStatus,
    date: data.date,
  };
}
