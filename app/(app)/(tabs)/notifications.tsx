import { Screen } from "@/components/Screen";
import { usePaginatedNotifications } from "@/features/notifications/usePaginateNotifications";
import { SwipeToDeleteNotification } from "@/shared/components/SwipeToDeleteNotification";
import LottieView from "lottie-react-native";
import { FlatList, StyleSheet, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";
// @ts-ignore
import Logo from "../../../shared/svg/logo.svg";

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
  return (
    
    <Screen>
      <FlatList
        data={notifications}
        onEndReached={() => {
          console.log("🚀 Reached end!");
          if (hasMore) loadMore();
        }}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refresh}
        extraData={notifications}
          initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
        keyExtractor={(item, index) =>
          item?.id || `fallback-${index}`
        }
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
        renderItem={({ item, index }) => (
          <Animatable.View
            animation="fadeInUp"
            duration={400}
            delay={index * 100}
            useNativeDriver
          >
            <SwipeToDeleteNotification item={item} onDelete={deleteOne} />
          </Animatable.View>
        )}
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
