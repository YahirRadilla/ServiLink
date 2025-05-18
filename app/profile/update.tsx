import { Screen } from "@/components/Screen";
import BackButton from "@/shared/components/BackButton";
import { CustomButton } from "@/shared/components/CustomButton";
import CustomInput from "@/shared/components/CustomInput";
import { Stack } from "expo-router";
import { Dimensions, Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useUserStore } from "@/entities/users";
// @ts-ignore
import Avatar from "../../shared/svg/avatar.svg";

export default function UpdateProfileScreen() {
  const { height } = Dimensions.get("window");
  const user = useUserStore((state) => state.user);
  const hasProfileImage = !!user?.imageProfile?.trim();
  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView className="flex-1 bg-primarybg-servilink gap-y-14">
        {/* Fondo decorativo */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 12 }}
          keyboardShouldPersistTaps="handled"
        >
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
          </View>
          <View className="items-center">
            <View className="w-[95%] max-w-md flex-col items-center">
              <View className="w-full flex-row gap-2">
                <View className="flex-1">
                  <CustomInput
                    type="text"
                    placeholder="Nombre"
                    label="Nombre"
                  />
                </View>
                <View className="flex-1">
                  <CustomInput
                    type="text"
                    placeholder="Apellido"
                    label="Apellido"
                  />
                </View>
              </View>

              <View className="w-full">
                <CustomInput
                  type="email"
                  placeholder="Correo electrónico"
                  label="Correo"
                />
              </View>

              <View className="w-full">
                <CustomInput
                  type="date"
                  label="Fecha de nacimiento"
                  placeholder="Seleccionar fecha"
                />
              </View>

              <View className="w-full">
                <CustomInput
                  type="number"
                  placeholder="Número de teléfono"
                  label="Número de teléfono"
                />
              </View>

              <View className="w-full">
                <CustomInput
                  type="password"
                  label="Contraseña"
                  placeholder="Contraseña"
                />
              </View>

              <View className="w-full">
                <CustomInput
                  type="password"
                  label="Confirmar contraseña"
                  placeholder="Confirmar contraseña"
                />
              </View>

              <View className="w-full mt-6 ">
                <CustomButton label="Guardar cambios" />
              </View>
            </View>
          </View>
        </ScrollView>
        <View className="absolute z-10 top-5 left-5 bg-black/50 p-2 rounded-full">
          <BackButton />
        </View>
      </SafeAreaView>
    </Screen>
  );
}
