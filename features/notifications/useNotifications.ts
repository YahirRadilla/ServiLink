import { useNotificationStore } from "@/entities/notifications";
import { useUserStore } from "@/entities/users";
import { useEffect, useState } from "react";
import { listenToNotificationsRealtime } from "./service"; // esta sí es válida

export const useNotifications = () => {
  const user = useUserStore((state) => state.user);
  const { setNotifications, clearNotifications } = useNotificationStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = listenToNotificationsRealtime(user.id, (newNotifications) => {
      setNotifications(newNotifications);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearNotifications();
    };
  }, [user?.id]);

  return { loading };
};
