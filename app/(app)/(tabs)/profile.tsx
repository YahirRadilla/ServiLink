import { Screen } from "@/components/Screen";
import { useUserStore } from "@/entities/users";
import { useAuth } from "@/features/auth/useAuth";
import { updateProviderStatus } from "@/features/users/services";
import FloatingSwitchButton from "@/shared/components/FloatingSwitchButton";
import { ProfileButtons } from "@/shared/components/ProfileButtons";
import * as Burnt from "burnt";
import { BlurView } from "expo-blur";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// @ts-ignore
import Avatar from "../../../shared/svg/avatar.svg";


export default function Profile() {
  const [animationKey, setAnimationKey] = useState(Date.now());
  const [isTogglingProvider, setIsTogglingProvider] = useState(false);

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  useFocusEffect(
    useCallback(() => {
      setAnimationKey(Date.now());
    }, [])
  );

  const router = useRouter();

  const handleTouchQuestion = () => {
    router.push("/questions");
  };

  const handleTouchUpdateProfile = () => {
    router.push("/profile/update");
  };

  const hanldeSavedPosts = () => {
    Burnt.toast({
      title: "prueba",
      message: "Esto es una prueba de Burnt",
      from: "top",
      preset: "done",
    });
    router.push("/notification/notification");
  };

  const handleTouchDashboard = () => {
    router.push("/dashboard/dashboard");
  };

  const handleTouchPayments = () => {
    router.push("/payments/payments");
  };

  const handleBeProvider = async () => {
    try {
      if (!user?.id || isTogglingProvider) return;

      setIsTogglingProvider(true);

      opacity.value = withTiming(0.4, { duration: 200 });
      scale.value = withTiming(0.97, { duration: 150 });

      setTimeout(() => {
        opacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) });
        scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) });
      }, 500);

      const isBecomingProvider = user.profileStatus !== "provider";

      if (isBecomingProvider) {
        await updateProviderStatus(user.id, "provider");

        setTimeout(() => {
          const newUser = useUserStore.getState().user;
          const rfc = newUser?.provider?.rfc;

          setIsTogglingProvider(false);

          if (!rfc || rfc.trim() === "") {
            router.push("/provider/create");
          }
        }, 500);
      } else {
        await updateProviderStatus(user.id, "client");
        setIsTogglingProvider(false);
      }
    } catch (error) {
      setIsTogglingProvider(false);
      console.error("❌ Error al manejar el cambio de proveedor:", error);
    }
  };


  const { signOut } = useAuth();
  const user = useUserStore((state) => state.user);
  const hasProfileImage = !!user?.imageProfile?.trim();
  /* console.log(user?.provider) */
  const isProvider = user?.profileStatus === "provider";

  return (
    <Screen>
      <Animated.View style={animatedStyle}>
        <FlatList
          data={[]}
          contentContainerStyle={{
            paddingVertical: 24,
            paddingHorizontal: 12,
            paddingBottom: 120,
          }}
          ListHeaderComponent={
            <View className="flex-col justify-between mb-6">
              <View className="flex-row">
                <Text className="text-white/90 font-bold ml-2 text-base pb-10">
                  Perfil
                </Text>
              </View>

              <View className=" items-center mb-6 space-y-3">
                {hasProfileImage ? (
                  <Image
                    source={{ uri: user?.imageProfile || "" }}
                    className="w-24 h-24 rounded-full border border-white/10"
                  />
                ) : (
                  <Avatar
                    width={96}
                    height={96}
                    style={{ borderRadius: 9999, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}
                  />
                )}
                <Text className="text-white font-bold text-xl">{user?.name}</Text>
              </View>

              <View className="rounded-xl overflow-hidden">
                {/* <ProfileButtons
                  title="Guardados"
                  icon="bookmark-outline"
                  onPress={hanldeSavedPosts}
                /> */}
                <ProfileButtons
                  title="Pagos"
                  icon="card-outline"
                  onPress={handleTouchPayments}
                />
                {/* <ProfileButtons
                  title="Dashboard"
                  icon="bar-chart-outline"
                  onPress={handleTouchDashboard}
                /> */}
                <View className="border-t border-white/10 my-4" />

                <ProfileButtons
                  title="Editar Perfil"
                  icon="person-outline"
                  onPress={handleTouchUpdateProfile}
                />
                <ProfileButtons
                  title="FAQs"
                  icon="information-circle-outline"
                  onPress={handleTouchQuestion}
                />

                <View className="border-t border-white/10 my-4" />
                <ProfileButtons
                  title="Eliminar Cuenta"
                  icon="close-circle-outline"
                  onPress={() => { }}
                  type="secondary"
                  chevron={false}
                />

                <ProfileButtons
                  title="Cerrar Sesión"
                  icon="log-out-outline"
                  onPress={signOut}
                  type="secondary"
                  chevron={false}
                />
              </View>
            </View>
          }
          renderItem={() => <></>}
        />
      </Animated.View>

      {isTogglingProvider && (
        <View className="absolute inset-0 z-50 w-full h-full">
          <BlurView intensity={0} tint="systemChromeMaterialDark" className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="white" />
          </BlurView>
        </View>
      )}

      <FloatingSwitchButton
        key={animationKey}
        label={isProvider ? "Cambiar a cliente" : "Cambiar a proveedor"}
        icon={isProvider ? "swap-horizontal" : "briefcase-outline"}
        onPress={handleBeProvider}
        visible={!isTogglingProvider}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});
