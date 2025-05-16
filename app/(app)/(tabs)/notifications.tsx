import { Screen } from "@/components/Screen";
import { useNotificationStore } from "@/entities/notifications";
import { useNotifications } from "@/features/notifications/useNotifications";
import { SwipeToDeleteNotification } from "@/shared/components/SwipeToDeleteNotification";
import { FlatList, StyleSheet, Text, View } from "react-native";

// @ts-ignore
import Logo from "../../../shared/svg/logo.svg";

export default function Notifications() {
  const { loading } = useNotifications();
  const notifications = useNotificationStore((state) => state.notifications);
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );
  const handleDelete = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated); // ✅ elimina del store
  };
  return (
    <Screen>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 24,
          paddingHorizontal: 12,
          paddingBottom: 120,
        }}
        ListHeaderComponent={
          <>
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-white text-2xl font-bold ml-2">
                  Notificaciones
                </Text>
              </View>
              <Logo />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <SwipeToDeleteNotification
            item={item}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={
          <Text className="text-white text-center mt-10">
            {loading
              ? "Cargando notificaciones..."
              : "Aún no tienes notificaciones"}
          </Text>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});
