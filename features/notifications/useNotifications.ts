import { useNotificationStore } from "@/entities/notifications";
import { useEffect, useState } from "react";
import { listenToNotifications } from "./service";

export const useNotifications = () => {
  const { setNotifications, clearNotifications } = useNotificationStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToNotifications((newNotifications) => {
      setNotifications(newNotifications);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearNotifications();
    };
  }, []);
  return { loading };
};
