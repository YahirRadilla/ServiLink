import { useNotificationStore } from "@/entities/notifications";
import { useUserStore } from "@/entities/users";
import { useEffect, useState } from "react";
import { listenToNotifications } from "./service";

export const useNotifications = () => {
  const { setNotifications, clearNotifications } = useNotificationStore();
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = listenToNotifications(user.id, (newNotifications) => {
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
