import { TNotification } from "@/entities/notifications";
import { useUserStore } from "@/entities/users";
import { useEffect, useState } from "react";
import { deleteNotification, listenToNotifications } from "./service";

export const usePaginatedNotifications = () => {
  const user = useUserStore((state) => state.user);

  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const mergeUniqueNotifications = (
    oldNotis: TNotification[],
    newNotis: TNotification[]
  ) => {
    const map = new Map<string, TNotification>();
    [...oldNotis, ...newNotis].forEach((n) => {
      if (n?.id) map.set(n.id, n);
    });
    return Array.from(map.values());
  };

  const loadMore = async () => {
  if (!user?.id || loading || !hasMore) return;

  setLoading(true);

  try {
    const { notifications: newNotis, last, hasMore: more } =
      await listenToNotifications(user.id, lastDoc);

    const merged = mergeUniqueNotifications(notifications, newNotis);

    if (
      newNotis.length === 0 ||
      merged.length === notifications.length ||
      !more
    ) {
      console.log("🛑 No hay más notificaciones.");
      setHasMore(false);
      return;
    }

    setNotifications(merged);
    setLastDoc(last);
    setHasMore(more);
  } catch (error) {
    console.error("❌ Error en loadMore:", error);
  } finally {
    setLoading(false); // 🔥 ESTO ES CRUCIAL
  }
};


const refresh = async () => {
  if (!user?.id) return;

  setIsRefreshing(true);
  setLoading(true); // también aquí por si usas loading en FlatList

  try {
    const { notifications: newNotis, last, hasMore: more } =
      await listenToNotifications(user.id);

    setNotifications(newNotis);
    setLastDoc(last);
    setHasMore(more);
  } catch (error) {
    console.error("❌ Error en refresh:", error);
  } finally {
    setIsRefreshing(false);
    setLoading(false); // 🔥 para evitar atascos
  }
};

const deleteOne = async (id: string) => {
  try {
    await deleteNotification(id);
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      // ⚠️ No fuerces loading sin permitir que se detenga
      if (updated.length < 10 && hasMore && !loading) {
        loadMore(); // sin setTimeout
      }
      return updated;
    });
  } catch (error) {
    console.error("Error eliminando notificación:", error);
  }
};

  useEffect(() => {
    if (user?.id) refresh();
  }, [user?.id]);

  return {
    notifications,
    loading,
    isRefreshing,
    refresh,
    loadMore,
    hasMore,
    deleteOne,
  };
};
