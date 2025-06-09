import { filtersData } from '@/data/filters';
import { usePosts } from '@/features/posts/usePosts';
import BackButton from '@/shared/components/BackButton';
import { CustomButton } from '@/shared/components/CustomButton';
import CustomInput from '@/shared/components/CustomInput';
import { useToastStore } from "@/shared/toastStore";
import { yupResolver } from '@hookform/resolvers/yup';
import { BlurView } from 'expo-blur';
import { Stack, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

const schema = Yup.object({
    title: Yup.string().required('Campo requerido'),
    description: Yup.string().required('Campo requerido'),
    minPrice: Yup.number()
        .typeError('Debe ser un número')
        .min(1, 'No puede ser negativo o cero')
        .required('Campo requerido'),
    maxPrice: Yup.number()
        .typeError('Debe ser un número')
        .moreThan(Yup.ref('minPrice'), 'Debe ser mayor que el precio mínimo')
        .required('Campo requerido'),
    neighborhood: Yup.string().required('Campo requerido'),
    streetAddress: Yup.string().required('Campo requerido'),
    service: Yup.string().required('Campo requerido'),
    images: Yup.array().required('Campo requerido').min(1, 'Selecciona al menos una imagen'),
    location: Yup.object({
        latitude: Yup.number().required('Campo requerido'),
        longitude: Yup.number().required('Campo requerido')
    }).nullable().required('Campo requerido'),
    zipCode: Yup.string().required('Campo requerido'),
    postType: Yup.string().required('Campo requerido'),
});

export default function CreatePostScreen() {
    const router = useRouter();
    const toast = useToastStore((s) => s.toastRef);
    const { loading, createNewPost } = usePosts();
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            minPrice: undefined,
            maxPrice: undefined,
            zipCode: '',
            location: null as any,
            images: [],
            neighborhood: '',
            streetAddress: '',
            service: '',
            postType: '',
        },
    });


    const onSubmit = async (data: any) => {
        const id = await createNewPost(data);
        if (!id) {
            toast?.show('Error al crear la publicación', 'error', 2000);
            console.error('Error al crear la publicación');
            return;
        } else {
            router.replace({ pathname: '/workspace', params: { refetch: 'true', tab: 'posts' } });
            toast?.show('Publicación creada correctamente', 'success', 2000);
        }
        console.log('Publicación enviada:', data);
    };

    return (
        <SafeAreaView className="flex-1 bg-primarybg-servilink">
            <Stack.Screen options={{ headerShown: false }} />
            <View className="flex-row items-center gap-x-4 p-4">
                <View className="bg-black/50 p-2 rounded-full">
                    <BackButton />
                </View>
                <Text className="text-white/90 font-bold ml-2 text-base">
                    Crear publicación
                </Text>
            </View>
            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
                <Text className="text-white text-2xl font-bold text-center mb-6">Crear publicación</Text>

                <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            label="Título"
                            placeholder="Escribe un título"
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
                            placeholder="Describe el servicio"
                            value={value}
                            onChangeText={onChange}
                            error={error?.message}
                            multiline
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="minPrice"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            label="Precio mínimo"
                            placeholder="$"
                            value={value}
                            onChangeText={onChange}
                            error={error?.message}
                            keyboardType="numeric"
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="maxPrice"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            label="Precio máximo"
                            placeholder="$"
                            value={value}
                            onChangeText={onChange}
                            error={error?.message}
                            keyboardType="numeric"
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
                            value={value}
                            options={
                                filtersData[1].options
                            }
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

                <Controller
                    control={control}
                    name="service"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            type="select"
                            label="Servicio"
                            placeholder="Selecciona un servicio"
                            options={
                                filtersData[2].options
                            }
                            value={value}
                            onChangeText={onChange}
                            error={error?.message}
                        />
                    )}
                />


                <Controller
                    control={control}
                    name="postType"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            type="select"
                            label="Tipo de publicación"
                            placeholder="Selecciona un tipo"
                            options={["Fija", "Personalizada"]}
                            value={value}
                            onChangeText={onChange}
                            error={error?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="location"
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <CustomInput
                            type="location"
                            label="Ubicación"
                            placeholder="Selecciona la ubicación"
                            value={value}
                            onChangeText={onChange}
                            error={error?.message}
                        />
                    )}
                />



                <Controller
                    control={control}
                    name="images"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            type="image"
                            label="Imagen principal"
                            value={value}
                            onChangeText={onChange}
                            error={error?.message}
                        />
                    )}
                />
                <View className="mb-6" />
                <CustomButton label="Publicar" loading={loading} onPress={handleSubmit(onSubmit)} />
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
