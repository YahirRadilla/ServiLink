import { filtersData } from "@/data/filters";
import { usePostStore } from "@/entities/posts";

import { useCreateProposals } from "@/features/proposals/useCreateProposal";

import BackButton from "@/shared/components/BackButton";
import { CustomButton } from "@/shared/components/CustomButton";
import CustomInput from "@/shared/components/CustomInput";
import { useToastStore } from "@/shared/toastStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { BlurView } from "expo-blur";

import { Stack, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

const schema = Yup.object({
    price: Yup.string().required("Campo requerido"),
    startDate: Yup.date().nullable().required('Selecciona una fecha'),
    payMethod: Yup.string().required("Campo requerido"),
    description: Yup.string().required("Campo requerido"),
    referenceImages: Yup.array()
        .of(Yup.string())
        .min(1, "Agrega al menos una imagen")
        .required("Campo requerido"),
    neighborhood: Yup.string().required("Campo requerido"),
    streetAddress: Yup.string().required("Campo requerido"),
    zipCode: Yup.string().required("Campo requerido"),
    location: Yup.object({
        latitude: Yup.number().required(),
        longitude: Yup.number().required(),
    })
        .nullable()
        .required("Campo requerido"),
});

export default function CreateProposalScreen() {
    const router = useRouter();
    const { loading, createNewProposal } = useCreateProposals();
    const currentPost = usePostStore((state) => state.currentPost);
    const toast = useToastStore((s) => s.toastRef);


    const {
        control,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            price: currentPost?.minPrice.toString(),
            startDate: undefined,
            payMethod: "",
            description: "",
            referenceImages: [],
            neighborhood: "",
            streetAddress: "",
            zipCode: "",
            location: null as any,
        },
    });

    const payMethod = watch("payMethod");


    const onSubmit = async (data: any) => {
        const result = await createNewProposal({
            ...data,
            providerId: currentPost?.provider.id,
            postId: currentPost?.id,
            offers: [
                {
                    time: new Date(),
                    price: Number(data.price),
                    active: true,
                    isClient: true,
                },
            ],
            address: {
                streetAddress: data.streetAddress,
                zipCode: Number(data.zipCode),
                neighborhood: data.neighborhood,
                latitude: data.location.latitude,
                longitude: data.location.longitude,
            },
            acceptStatus: "pending",
        });

        if (result) {
            toast?.show("Propuesta enviada con éxito", "success", 2000);
            router.back();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-primarybg-servilink">
            <Stack.Screen options={{ headerShown: false }} />
            <View className="flex-row items-center gap-x-4 p-4">
                <View className="bg-black/50 p-2 rounded-full">
                    <BackButton />
                </View>
                <Text className="text-white/90 font-bold ml-2 text-base">Crear Propuesta</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
                <Text className="text-white text-2xl font-bold mb-6">
                    Propuesta – {currentPost?.title}
                </Text>

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

                <Controller
                    control={control}
                    name="payMethod"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            type="select"
                            label="Método de pago"
                            placeholder="Elige tu método de pago"
                            options={["Tarjeta", "Efectivo"]}
                            value={value}
                            onChangeText={onChange}
                            error={error?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            label="Descripción"
                            placeholder="Describe el servicio que deseas"
                            multiline
                            value={value}
                            onChangeText={onChange}
                            error={error?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="referenceImages"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            type="image"
                            label="Adjuntar imágenes"
                            value={value}
                            onChangeText={onChange}
                            error={error?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="neighborhood"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            type="select"
                            label="Colonia"
                            placeholder="Ej: Los Olivos"
                            options={filtersData[1].options}
                            value={value}
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
                            placeholder="Ej: Av. Hidalgo"
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

                <Controller
                    control={control}
                    name="location"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            type="location"
                            label="Ubicación en el mapa"
                            value={value}
                            onChangeText={onChange}
                            error={error?.message}
                        />
                    )}
                />

                <View className="mb-6" />
                <CustomButton
                    label="Mandar solicitud"
                    loading={loading}
                    onPress={handleSubmit(onSubmit)}
                />
            </ScrollView>
            {loading && (
                <View className="absolute inset-0 z-50 w-full h-full">
                    <BlurView intensity={60} tint="systemChromeMaterialDark" className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="white" />
                    </BlurView>
                </View>
            )}
        </SafeAreaView>
    );
}
