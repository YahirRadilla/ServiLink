import { CustomButton } from "@/shared/components/CustomButton";
import CustomInput from "@/shared/components/CustomInput";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import * as Yup from "yup";

type FormValues = {
    price: number;
    startDate: Date | null;
};

const schema: Yup.ObjectSchema<FormValues> = Yup.object({
    price: Yup.number()
        .typeError("Debe ser un número")
        .min(1, "El precio no puede ser negativo o cero")
        .required("Campo requerido"),
    startDate: Yup.date()
        .nullable()
        .required("Selecciona una fecha"),
});


export function FormBottomSheetModal({
    visible,
    onClose,
    onSubmit,
    title,
    defaultValues,
}: {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    title: string;
    defaultValues: {
        price: number;
        startDate: Date | null | undefined;
    };
}) {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["100%"], []);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        mode: "onSubmit",
        defaultValues: {
            price: defaultValues.price,
            startDate: defaultValues.startDate ?? null,
        },
    });




    const renderBackdrop = (props: any) => (
        <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior="close"
            opacity={0.6}
        />
    );

    return (
        <>
            {visible && (
                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    onClose={onClose}
                    backdropComponent={renderBackdrop}
                    backgroundStyle={{ backgroundColor: "#161622" }}
                    handleIndicatorStyle={{ backgroundColor: "white" }}
                >
                    <BottomSheetScrollView
                        contentContainerStyle={{ padding: 24 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text className="text-white text-2xl font-bold mb-4">{title}</Text>

                        <Controller
                            control={control}
                            name="price"
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <CustomInput
                                    label="Precio oferta"
                                    placeholder="$2000"
                                    value={value}
                                    onChangeText={onChange}
                                    error={error?.message}
                                    keyboardType="numeric"
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="startDate"
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <CustomInput
                                    type="futureDate"
                                    label="Fecha inicio"
                                    value={value}
                                    onDateChange={onChange}
                                    placeholder="Seleccionar fecha"
                                    error={error?.message}
                                />
                            )}
                        />

                        <View className="mt-6">
                            <CustomButton label="Enviar" onPress={handleSubmit(onSubmit)} />
                        </View>
                    </BottomSheetScrollView>
                </BottomSheet>
            )}
        </>
    );
}
