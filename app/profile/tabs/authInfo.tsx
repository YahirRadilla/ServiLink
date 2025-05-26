import { useUserStore } from "@/entities/users";
import { auth } from "@/lib/firebaseConfig";
import CustomInput from "@/shared/components/CustomInput";
import { useToastStore } from "@/shared/toastStore";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ScrollView } from "react-native";


export default function AuthInfoTab() {
    const toast = useToastStore((s) => s.toastRef);
    const { control, watch, formState: { errors } } = useFormContext();
    const [emailVerified, setEmailVerified] = useState<boolean | null>(null);

    useEffect(() => {
        const cheackVerification = async () => {
            await auth.currentUser?.reload();
            setEmailVerified(auth.currentUser?.emailVerified ?? null);
        };
        cheackVerification();
    }, []);

    const user = useUserStore((state) => state.user);

    const email = watch("email");
    const password = watch("password");
    const confirmPassword = watch("confirmPassword");

    const showCurrenPassword = user?.email !== email || password || confirmPassword;
    return (
        <ScrollView
            className="px-4 py-2"
            contentContainerStyle={{ gap: 8, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <CustomInput
                        type="email"
                        label="Correo"
                        placeholder="Correo electrónico"
                        value={value}
                        onChangeText={onChange}
                        error={error?.message}
                    />
                )}
            />
{/*             <View className={`flex-row justify-center items-center rounded-xl px-5 py-3 ${emailVerified
                ? "bg-active-status-servilink/20"
                : "bg-pending-status-servilink/40"
                }`}
            >
                <Ionicons
                    name={emailVerified ? "mail-open-outline" : "mail-outline"}
                    size={20} color="white" />
                <Text className="text-white font-bold text-sm ml-2">
                    {emailVerified ? "Correo verificado" : "Verificar Correo electrónico"}
                </Text>
            </View> */}

            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <CustomInput
                        type="password"
                        label="Nueva contraseña"
                        placeholder="Contraseña"
                        value={value}
                        onChangeText={onChange}
                        error={error?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <CustomInput
                        type="password"
                        label="Confirmar nueva contraseña"
                        placeholder="Confirmar contraseña"
                        value={value}
                        onChangeText={onChange}
                        error={error?.message}
                    />
                )}
            />

            {showCurrenPassword && (
                <Controller
                    control={control}
                    name="currentPassword"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            type="password"
                            label="Contraseña actual"
                            placeholder="Contraseña actual"
                            value={value}
                            onChangeText={onChange}
                            error={error?.message}
                        />
                    )}
                />
            )}


        </ScrollView>
    )
}