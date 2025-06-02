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
            contentContainerStyle={{ paddingBottom: 84 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
        >
            {/* Inputs */}
            <View>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            label="Nombre(s)"
                            placeholder="Nombre"
                            value={value}
                            onChangeText={onChange}
                            error={error?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            label="Primer apellido"
                            placeholder="Primer apellido"
                            value={value}
                            onChangeText={onChange}
                            error={error?.message}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="secondLastname"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            label="Segundo apellido"
                            placeholder="Segundo apellido"
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
                            type="birthday"
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


            </View>
        </ScrollView>
    );
}
