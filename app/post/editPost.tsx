import { SingleEntityScreen } from "@/components/SingleEntityScreen";
import { filtersData } from "@/data/filters";
import { TPost } from "@/entities/posts";
import { updatePost } from "@/features/posts/services";
import { usePosts } from "@/features/posts/usePosts";
import BackButton from "@/shared/components/BackButton";
import { CustomButton } from "@/shared/components/CustomButton";
import CustomInput from "@/shared/components/CustomInput";
import { useToastStore } from "@/shared/toastStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

const schema = Yup.object({
    title: Yup.string().required("Campo requerido"),
    description: Yup.string().required("Campo requerido"),
    minPrice: Yup.string().required("Campo requerido"),
    maxPrice: Yup.string().required("Campo requerido"),
    zipCode: Yup.string().required("Campo requerido"),
    location: Yup.object({
        latitude: Yup.number().required("Campo requerido"),
        longitude: Yup.number().required("Campo requerido"),
    }).nullable().required("Campo requerido"),
    images: Yup.array().required("Campo requerido").min(1, "Selecciona al menos una imagen"),
    neighborhood: Yup.string().required("Campo requerido"),
    streetAddress: Yup.string().required("Campo requerido"),
    service: Yup.string().required("Campo requerido"),
    postType: Yup.string().required("Campo requerido"),
});

export default function EditPostScreen() {
    const { id } = useLocalSearchParams();
    const toast = useToastStore((s) => s.toastRef);
    const router = useRouter();
    const { getPost, loading } = usePosts();
    const [post, setPost] = useState<TPost | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: "",
            description: "",
            minPrice: "",
            maxPrice: "",
            zipCode: "",
            location: undefined,
            images: [],
            neighborhood: "",
            streetAddress: "",
            service: "",
            postType: "",
        },
    });

    useEffect(() => {
        getPost(id as string).then((post) => {
            setPost(post);
            reset({
                title: post?.title,
                description: post?.description,
                minPrice: post?.minPrice.toString(),
                maxPrice: post?.maxPrice.toString(),
                zipCode: post?.address.zipCode,
                location: {
                    latitude: post?.address.latitude ?? undefined,
                    longitude: post?.address.longitude ?? undefined,
                },
                images: post?.images,
                neighborhood: post?.address.neighborhood,
                streetAddress: post?.address.streetAddress,
                service: post?.service,
                postType: post?.postType,
            });
        });
    }, []);

    const onSubmit = async (data: any) => {
        const success = await updatePost(id as string, data);
        if (success) {
            toast?.show("Publicación actualizada correctamente", "success", 2000);
            router.replace({ pathname: "/workspace", params: { refetch: "true", tab: "posts" } });
        } else {
            toast?.show("Error al actualizar la publicación", "error", 2000);
        }
    };

    if (loading || !post) {
        return (
            <SingleEntityScreen>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 justify-center items-center bg-primarybg-servilink px-4">
                    <LottieView
                        source={require("@/assets/animations/loading.json")}
                        autoPlay
                        loop
                        style={{ width: 120, height: 120 }}
                    />
                    <Text className="text-white/60 mt-4 text-base">
                        Cargando publicación...
                    </Text>
                </View>
            </SingleEntityScreen>
        );
    }


    return (
        <SafeAreaView className="flex-1 bg-primarybg-servilink">
            <Stack.Screen options={{ headerShown: false }} />
            <View className="flex-row items-center gap-x-4 p-4">
                <View className="bg-black/50 p-2 rounded-full">
                    <BackButton />
                </View>
                <Text className="text-white/90 font-bold ml-2 text-base">Editar publicación</Text>
            </View>
            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
                <Text className="text-white text-2xl font-bold text-center mb-6">Editar publicación</Text>

                <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput label="Título" placeholder="Escribe un título" value={value} onChangeText={onChange} error={error?.message} />
                    )}
                />

                <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput label="Descripción" placeholder="Describe el servicio" value={value} onChangeText={onChange} error={error?.message} multiline />
                    )}
                />

                <Controller
                    control={control}
                    name="minPrice"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput label="Precio mínimo" placeholder="$" value={value} onChangeText={onChange} error={error?.message} keyboardType="numeric" />
                    )}
                />

                <Controller
                    control={control}
                    name="maxPrice"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput label="Precio máximo" placeholder="$" value={value} onChangeText={onChange} error={error?.message} keyboardType="numeric" />
                    )}
                />

                <Controller
                    control={control}
                    name="neighborhood"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput type="select" label="Colonia" placeholder="Ej: Los Olivos" value={value} options={filtersData[1].options} onChangeText={onChange} error={error?.message} />
                    )}
                />

                <Controller
                    control={control}
                    name="streetAddress"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput label="Calle" placeholder="Ej: 5 de Mayo" value={value} onChangeText={onChange} error={error?.message} />
                    )}
                />

                <Controller
                    control={control}
                    name="zipCode"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput label="Código postal" placeholder="Ej: 23020" keyboardType="numeric" value={value} onChangeText={onChange} error={error?.message} />
                    )}
                />

                <Controller
                    control={control}
                    name="service"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput type="select" label="Servicio" placeholder="Selecciona un servicio" options={filtersData[2].options} value={value} onChangeText={onChange} error={error?.message} />
                    )}
                />

                <Controller
                    control={control}
                    name="postType"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput type="select" label="Tipo de publicación" placeholder="Selecciona un tipo" options={["Fija", "Personalizada"]} value={value} onChangeText={onChange} error={error?.message} />
                    )}
                />

                <Controller
                    control={control}
                    name="location"
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <CustomInput type="location" label="Ubicación" placeholder="Selecciona la ubicación" value={value} onChangeText={onChange} error={error?.message} />
                    )}
                />

                <Controller
                    control={control}
                    name="images"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput type="image" label="Imagen principal" value={value} onChangeText={onChange} error={error?.message} />
                    )}
                />

                <View className="mb-6" />
                <CustomButton label="Guardar cambios" onPress={handleSubmit(onSubmit)} />
            </ScrollView>
        </SafeAreaView>
    );
}
