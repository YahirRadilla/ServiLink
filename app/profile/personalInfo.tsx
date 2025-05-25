import { useUserStore } from "@/entities/users";
import CustomInput from "@/shared/components/CustomInput";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ScrollView, View } from "react-native"; // <-- Importa ScrollView


export default function PersonalInfoTab() {
    const user = useUserStore((state) => state.user);
    const hasProfileImage = !!user?.imageProfile?.trim();

    const [profileImage, setProfileImage] = useState(user?.imageProfile || "");

    const { control, formState: { errors }, handleSubmit } = useFormContext();

    return (
        <ScrollView 
            className="px-4"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {/* Inputs */}
            <View>
                <View className="flex-row gap-2">
                    <View className="flex-1">
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <CustomInput
                                    label="Nombre"
                                    placeholder="Nombre"
                                    value={value}
                                    onChangeText={onChange}
                                    error={error?.message}
                                />
                            )}
                        />
                    </View>
                    <View className="flex-1">
                        <Controller
                            control={control}
                            name="lastName"
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <CustomInput
                                    label="Apellido"
                                    placeholder="Apellido"
                                    value={value}
                                    onChangeText={onChange}
                                    error={error?.message}
                                />
                            )}
                        />
                    </View>
                </View>

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

                <Controller
                    control={control}
                    name="birthDate"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            type="date"
                            label="Fecha de nacimiento"
                            placeholder="Seleccionar fecha"
                            value={value}
                            onDateChange={onChange}
                            error={error?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            type="number"
                            label="Número de teléfono"
                            placeholder="Número de teléfono"
                            value={value}
                            onChangeText={onChange}
                            error={error?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            type="password"
                            label="Contraseña"
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
                            label="Confirmar contraseña"
                            placeholder="Confirmar contraseña"
                            value={value}
                            onChangeText={onChange}
                            error={error?.message}
                        />
                    )}
                />
            </View>
        </ScrollView>
    );
}
