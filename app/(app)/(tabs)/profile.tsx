import { Screen } from "@/components/Screen";
import { useAuth } from "@/features/auth/useAuth";
import { CustomButton } from "@/shared/components/CustomButton";
import { ProfileButtons } from "@/shared/components/ProfileButtons";
import { Image, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function Profile() {
  const { signOut } = useAuth();

  const user = {
    name: "Jaime Fernandez",
    image: "https://randomuser.me/api/portraits/men/25.jpg",
  };

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
              <Image
                source={{ uri: user.image }}
                className="w-28 h-28 rounded-full"
              />
              <Text className="text-white font-bold text-xl">{user.name}</Text>
            </View>

            <ProfileButtons
              title="Tablero"
              icon="calendar-outline"
              onPress={() => {}}
            />
            <ProfileButtons
              title="Pagos"
              icon="card-outline"
              onPress={() => {}}
            />
            <View className="border-t border-white/10 my-4" />

            <ProfileButtons
              title="Editar Perfil"
              icon="person-outline"
              onPress={() => {}}
            />
            <ProfileButtons
              title="Convertirse en proveedor"
              icon="briefcase-outline"
              onPress={() => {}}
            />
            <ProfileButtons
              title="FAQs"
              icon="information-circle-outline"
              onPress={() => {}}
            />

            <View className="border-t border-white/10 my-4" />

            <ProfileButtons
              title="Eliminar Cuenta"
              icon="close-circle-outline"
              onPress={() => {}}
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
        }
        renderItem={() => <></>}
      />
      <CustomButton className="mt-6" label="Cerrar sesion" onPress={signOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({});
