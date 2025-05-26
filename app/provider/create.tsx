import { Screen } from "@/components/Screen";
import { useUserStore } from "@/entities/users";
import { updateProviderRFC, updateProviderStatus } from "@/features/users/services";
import BackButton from "@/shared/components/BackButton";
import { CustomButton } from "@/shared/components/CustomButton";
import CustomInput from "@/shared/components/CustomInput";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text } from "react-native";
import { View } from "react-native-animatable";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";

const schema = () => Yup.object({
  rfc: Yup.string()
    .required("El RFC es obligatorio")
    .matches(/^[A-Z]{3,4}\d{6}[A-Z0-9]{3}$/, "RFC inválido"),
})

export default function CreateProviderScreen() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();


  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema()),
    defaultValues: {
      rfc: "",
    },
  })
  const onSubmit = async (data: { rfc: string }) => {
    /* console.log(user?.provider);
    console.log("📤 Enviando datos del formulario:", data); */

    try {
      if (!user?.id || !user.provider?.id) {
        console.warn("Usuario o provider no disponible");
        return;
      }

      await updateProviderRFC(user.id, data.rfc.trim(), user.provider.id);
      router.replace("/profile");
    } catch (error) {
      console.error("❌ Error al actualizar el RFC:", error);
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center gap-x-4 p-4">
        <View className="bg-black/50 p-2 rounded-full">
          <BackButton onPress={async () => {
            if (user?.id && (!user.provider?.rfc || user.provider.rfc.trim() === "")) {
              await updateProviderStatus(user.id, "client");
            }
            router.back();
          }} />
        </View>
        <Text className="text-white/90 font-bold ml-2 text-base">Proveedor</Text>
      </View>

      <View className="flex-1 bg-primarybg-servilink">
        <KeyboardAwareScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          enableOnAndroid
          extraScrollHeight={60}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-white text-3xl font-bold mb-2">
            ¡Estás a un paso de ser proveedor!
          </Text>
          <Text className="text-white/70 text-base">
            Ser un proveedor tiene beneficios y puedes recibir dinero por tu
            trabajo. Completa tu RFC para continuar.
          </Text>

          <View className="border-t border-white/10 my-4" />

          <Text className="text-white/70 text-base mt-2 mb-4 font-bold">
            Al convertirte en proveedor podrás:
          </Text>

          <View className="flex-row items-center gap-x-3 mb-2">
            <Ionicons name="card-outline" size={20} color="white" />
            <Text className="text-white/80 text-base">
              Recibe pagos directamente en tu cuenta
            </Text>
          </View>
          <View className="flex-row items-center gap-x-3 mb-2">
            <Ionicons name="briefcase-outline" size={20} color="white" />
            <Text className="text-white/80 text-base">
              Encuentra más oportunidades de trabajo
            </Text>
          </View>
          <View className="flex-row items-center gap-x-3 mb-4">
            <Ionicons name="checkmark-done-outline" size={20} color="white" />
            <Text className="text-white/80 text-base">
              Administra tus propuestas fácilmente
            </Text>
          </View>

          <View className="border-t border-white/10 mt-7 mb-2" />
          <Controller
            control={control}
            name="rfc"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomInput
                type="text"
                placeholder="Ingresa tu RFC"
                label="RFC"
                value={value}
                onChangeText={onChange}
                error={error?.message}
              />
            )}
          />
        </KeyboardAwareScrollView>

        <View
          className="absolute bottom-0 left-0 right-0 px-4 pb-6 bg-primarybg-servilink"
          style={{ zIndex: 10 }}
        >
          <CustomButton label="Continuar" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    </Screen>
  );
}

