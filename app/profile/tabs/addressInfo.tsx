import { filtersData } from "@/data/filters";
import CustomInput from "@/shared/components/CustomInput";
import { Controller, useFormContext } from "react-hook-form";
import { ScrollView } from "react-native";

export default function AddressTab() {
    const { control, formState: { errors } } = useFormContext();

    return (
        <ScrollView
            className="px-4 py-2"
            contentContainerStyle={{ gap: 8, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <Controller
                control={control}
                name="neighborhood"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <CustomInput
                        type="select"
                        label="Colonia"
                        placeholder="Ej: Los Olivos"
                        value={value}
                        options={filtersData[1].options}
                        onChangeText={onChange}
                        error={error?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="streetAddress"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <CustomInput
                        label="Calle"
                        placeholder="Ej: 5 de Mayo"
                        value={value}
                        onChangeText={onChange}
                        error={error?.message}
                    />
                )}
            />

            <Controller
                control={control}
                name="zipCode"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <CustomInput
                        label="Código postal"
                        placeholder="Ej: 23020"
                        keyboardType="numeric"
                        value={value}
                        onChangeText={onChange}
                        error={error?.message}
                    />
                )}
            />
        </ScrollView>
    );
}
