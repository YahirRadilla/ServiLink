import { Screen } from "@/components/Screen";
import { useUserStore } from "@/entities/users";
import { useAuth } from "@/features/auth/useAuth";
import { CustomButton } from "@/shared/components/CustomButton";
import { ProfileButtons } from "@/shared/components/ProfileButtons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

// @ts-ignore
import Avatar from "../../../shared/svg/avatar.svg";


export default function Profile() {

  const router = useRouter();

  const handleTouchQuestion = () => {
    router.push("/questions");
  };

    const handleTouchUpdateProfile = () => {
    router.push("/profile/update");
  };

  const handleTouchWorkspace = () => {
    router.push("/workspace/workspace");
  };

    const handleBeProvider = () => {
    router.push("/provider/create");
  };

  const { signOut } = useAuth();
  const user = useUserStore((state) => state.user);
  const hasProfileImage = !!user?.imageProfile?.trim();


  return (
    <Screen>
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
              <ProfileButtons
                title="Tablero"
                icon="calendar-outline"
                onPress={handleTouchWorkspace}
              />
              <ProfileButtons
                title="Pagos"
                icon="card-outline"
                onPress={() => { }}
              />
              <View className="border-t border-white/10 my-4" />

              <ProfileButtons
                title="Editar Perfil"
                icon="person-outline"
                onPress={handleTouchUpdateProfile}
              />
              <ProfileButtons
                title="Convertirse en proveedor"
                icon="briefcase-outline"
                onPress={handleBeProvider}
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
      <CustomButton className="mt-6" label="Cerrar sesion" onPress={signOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({});
