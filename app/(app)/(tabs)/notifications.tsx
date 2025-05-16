import { Screen } from "@/components/Screen";
import { useNotificationStore } from "@/entities/notifications";
import { useNotifications } from "@/features/notifications/useNotifications";
import { NotificationCard } from "@/shared/components/NotificationCard";
import { FlatList, StyleSheet, Text, View } from "react-native";

// @ts-ignore
import Logo from "../../../shared/svg/logo.svg";

const dataTest = [
  {
    id: "1",
    title: "Notificación",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum delectus est architecto! Id temporibus ex, laboriosam fugiat rem omnis, animi repellat placeat dolorum et suscipit maxime molestias eveniet optio voluptas?",
    time: "08:06 PM",
    seen: false,
  },
  {
    id: "2",
    title: "Notificación",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum delectus est architecto! Id temporibus ex, laboriosam fugiat rem omnis, animi repellat placeat dolorum et suscipit maxime molestias eveniet optio voluptas?",
    time: "08:06 PM",
    seen: true,
  },
];

export default function Notifications() {
  const { loading } = useNotifications();
  const notifications = useNotificationStore((state) => state.notifications);
  console.log("notificaciones en store:", notifications);
  const handleDelete = (id: string) => {
    console.log("eliminarNotificación", id);
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
          <NotificationCard
            onDelete={() => handleDelete(item.id)}
            title={item.title}
            content={item.content}
            date={item.date}
            seen={item.seen}
            showDelete={true}
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
