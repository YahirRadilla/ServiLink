import { TNotification } from "@/entities/notifications";
import { getDoc } from "firebase/firestore";

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
