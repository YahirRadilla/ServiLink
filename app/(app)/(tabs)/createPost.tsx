import { filtersData } from '@/data/filters';
import { CustomButton } from '@/shared/components/CustomButton';
import CustomInput from '@/shared/components/CustomInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

const schema = Yup.object({
    title: Yup.string().required('Campo requerido'),
    description: Yup.string().required('Campo requerido'),
    minPrice: Yup.string().required('Campo requerido'),
    maxPrice: Yup.string().required('Campo requerido'),
    neighborhood: Yup.string().required('Campo requerido'),
    streetAddress: Yup.string().required('Campo requerido'),
    service: Yup.string().required('Campo requerido'),
    images: Yup.array().required('Campo requerido'),
    location: Yup.object().required('Campo requerido'),
    postType: Yup.string().required('Campo requerido'),
});

export default function CreatePostScreen() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            minPrice: '',
            maxPrice: '',
            location: {},
            images: [],
            neighborhood: '',
            streetAddress: '',
            service: '',
            postType: '',
        },
    });

    const onSubmit = async (data: any) => {
        console.log('Publicación enviada:', data);
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-primarybg-servilink">
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
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <CustomInput
                            type="location"
                            label="Ubicación"
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

                <CustomButton label="Publicar" className="mt-6" onPress={handleSubmit(onSubmit)} />
            </ScrollView>
        </SafeAreaView>
    );
}
