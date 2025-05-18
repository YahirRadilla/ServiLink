import { Screen } from "@/components/Screen";
import { usePaginatedNotifications } from "@/features/notifications/usePaginateNotifications";
import { SwipeToDeleteNotification } from "@/shared/components/SwipeToDeleteNotification";
import LottieView from "lottie-react-native";
import { FlatList, StyleSheet, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";
// @ts-ignore
import Logo from "../../../shared/svg/logo.svg";

function groupNotificationsByDate(notifications: any[]) {
  const grouped: Record<string, any[]> = {};

  for (const noti of notifications) {
    const date = noti.createdAt.toDate().toISOString().split("T")[0]; // e.g. "2025-05-17"
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(noti);
  }

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const result = [];

  for (const date of sortedDates) {
    const rawDate = new Date(date).toLocaleDateString("es-MX", {
      month: "long",
      day: "numeric",
    });
    const formattedDate = rawDate
      .replace(
        /(\d{1,2}) de ([a-záéíóúñ])/i,
        (_, day, firstLetter) => `${day} de ${firstLetter.toUpperCase()}`
      )
      .replace(
        /(\d{1,2}) de ([A-Z])([a-záéíóúñ]+)/,
        (_, day, firstLetter, restOfMonth) =>
          `${day} de ${firstLetter}${restOfMonth}`
      );

    result.push({
      id: `header-${date}`,
      type: "header",
      label: formattedDate,
    });

    for (const noti of grouped[date]) {
      result.push({
        ...noti,
        type: "notification",
        dateKey: date,
      });
    }
  }

  return result;
}

export default function Notifications() {
  const {
    notifications,
    loading,
    isRefreshing,
    refresh,
    loadMore,
    hasMore,
    deleteOne,
  } = usePaginatedNotifications();
  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <Screen>
      <FlatList
        data={groupedNotifications}
        onEndReached={() => {
          if (hasMore) loadMore();
        }}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refresh}
        extraData={notifications}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        keyExtractor={(item, index) => item?.id || `fallback-${index}`}
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 24,
          paddingHorizontal: 12,
          paddingBottom: 120,
        }}
        ListHeaderComponent={
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-white text-2xl font-bold ml-2">
                Notificaciones
              </Text>
            </View>
            <Logo />
          </View>
        }
        renderItem={({ item }) => {
          if (item.type === "header") {
            return (
              <Text className="text-white/80 font-semibold text-lg mb-2 ml-1">
                {item.label}
              </Text>
            );
          }

          return (
            <Animatable.View>
              <SwipeToDeleteNotification item={item} onDelete={deleteOne} />
            </Animatable.View>
          );
        }}
        ListFooterComponent={
          hasMore && loading && notifications.length > 0 ? (
            <View className="w-full py-6 items-center justify-center">
              <LottieView
                source={require("../../../assets/animations/loading.json")}
                autoPlay
                loop
                style={{ width: 80, height: 80 }}
              />
            </View>
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <View className="w-full mt-20 items-center justify-center">
              <LottieView
                source={require("../../../assets/animations/loading.json")}
                autoPlay
                loop
                style={{ width: 100, height: 100 }}
              />
              <Text className="text-white/60 mt-4">
                Cargando notificaciones...
              </Text>
            </View>
          ) : (
            <Text className="text-white text-center mt-10">
              Aún no tienes notificaciones
            </Text>
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});
