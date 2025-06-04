import { Screen } from "@/components/Screen";
import { auth } from "@/lib/firebaseConfig";
import BackButton from "@/shared/components/BackButton";
import { CustomButton } from "@/shared/components/CustomButton";
import CustomInput from "@/shared/components/CustomInput";
import { useToastStore } from "@/shared/toastStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text } from "react-native";
import { View } from "react-native-animatable";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";

const schema = () => Yup.object({
    email: Yup.string().email('Correo inválido').required('Campo requerido'),
})

export default function forgotPasswordScreen() {
    const router = useRouter();
    const toast = useToastStore((s) => s.toastRef);
    const [loading, setLoading] = useState(false);


    const { control, handleSubmit } = useForm({
        resolver: yupResolver(schema()),
        defaultValues: {
            email: "",
        },
    })
    const onSubmit = async (data: { email: string }) => {
        if (loading) return;

        try {
            setLoading(true);
            await sendPasswordResetEmail(auth, data.email);
            router.replace("/profile");
            toast?.show("Correo de restablecimiento enviado", "success", 3000);
        } catch (error: any) {
            console.error("Error:", error);
            let message = "Ocurrió un error. Intenta más tarde.";
            if (error.code === "auth/user-not-found") {
                message = "No hay una cuenta asociada a este correo.";
            } else if (error.code === "auth/invalid-email") {
                message = "Correo electrónico inválido.";
            }
            toast?.show(message, "error", 3000);
        } finally {
            setLoading(false);
        }
    };



    return (
        <Screen>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-row items-center gap-x-4 p-4">
                <View className="bg-black/50 p-2 rounded-full">
                    <BackButton />
                </View>
                <Text className="text-white/90 font-bold ml-2 text-base">Cambiar contraseña</Text>
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
                        ¿Olvidaste tu contraseña?
                    </Text>
                    <Text className="text-white/70 text-base">
                        Para cambiar tu contraseña introduce tu correo electrónico y posteriormenete te enviaremos un enlace para restablecerla.
                    </Text>

                    <View className="border-t border-white/10 mt-7 mb-2" />
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <CustomInput
                                type="email"
                                placeholder="Ingresa tu correo electrónico"
                                label="Correo electrónico"
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
                    <CustomButton
                        label={loading ? "Enviando..." : "Continuar"}
                        onPress={handleSubmit(onSubmit)}
                        disabled={loading}
                    />
                </View>
            </View>
        </Screen>
    );
}

