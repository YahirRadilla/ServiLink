import { RegisterUserProps } from '@/features/auth/services';
import { useAuthStore } from '@/features/auth/store';
import { useAuth } from '@/features/auth/useAuth';
import { CustomButton } from '@/shared/components/CustomButton';
import CustomInput from '@/shared/components/CustomInput';
import { useToastStore } from '@/shared/toastStore';
import { yupResolver } from '@hookform/resolvers/yup';
import { BlurView } from 'expo-blur';
import { Link, router, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
// @ts-ignore
import Logo from '../../shared/svg/logo.svg';

const schema = Yup.object({
    name: Yup.string().min(3, 'Mínimo 3 caracteres').required('Campo requerido'),
    lastName: Yup.string().required('Campo requerido'),
    email: Yup.string().email('Correo inválido').required('Campo requerido'),
    birthDate: Yup.date().nullable().required('Selecciona una fecha'),
    phone: Yup.string()
        .matches(/^[0-9]+$/, 'Solo números')
        .length(10, 'Debe tener 10 dígitos')
        .required('Campo requerido'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Campo requerido'),
    remember: Yup.boolean().oneOf([true], 'Debes aceptar los términos'),
});

export default function RegisterScreen() {
    const { height } = Dimensions.get('window');
    const navigation = useNavigation();
    const { register } = useAuth();
    const loading = useAuthStore((state) => state.isLoading);
    const toast = useToastStore((s) => s.toastRef);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            lastName: '',
            email: '',
            birthDate: undefined,
            phone: '',
            password: '',
            remember: false,
        },
    });

    const onSubmit = async (data: any) => {
        const registerData: RegisterUserProps = {
            email: data.email,
            password: data.password,
            name: data.name,
            lastname: data.lastName,
            secondLastname: "",
            phoneNumber: data.phone,
            address: null,
            profileStatus: "client",
            imageProfile: "",
            birthDate: data.birthDate,
            providerId: null
        };

        try {
            await register(registerData);
            toast?.show("La cuenta se ha creado exitosamente", "success", 1500);
            router.replace('/auth/login');
        } catch (error: any) {
            if ((error as { message: string }).message.includes("auth/email-already-in-use")) {
                toast?.show("El correo ya se encuentra registrado", "error", 2000);
            }
            console.log(error);
        }
    };

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-primarybg-servilink gap-y-14">
            <View style={{ height: height / 2.4 }} className="w-full bg-neutral800 absolute top-0 z-1" />

            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingVertical: 24 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="gap-y-10">
                    <View className="w-full flex-col items-center gap-2 pt-5 z-10 ">
                        <Logo />
                        <View className="h-4" />
                        <Text className="text-center text-white text-3xl font-bold ">Registrar una cuenta</Text>
                    </View>

                    <View className="items-center">
                        <View className="w-[95%] max-w-md flex-col items-center z-0 bg-primarybg-servilink p-4 rounded-xl shadow-md shadow-white">
                            <View className="w-full flex-row gap-2">
                                <View className="flex-1">
                                    <Controller
                                        control={control}
                                        name="name"
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <CustomInput
                                                type="text"
                                                placeholder="Nombre"
                                                value={value}
                                                onChangeText={onChange}
                                                label="Nombre"
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
                                                type="text"
                                                placeholder="Apellido"
                                                value={value}
                                                onChangeText={onChange}
                                                label="Apellido"
                                                error={error?.message}
                                            />
                                        )}
                                    />
                                </View>
                            </View>

                            <View className="w-full">
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <CustomInput
                                            type="email"
                                            placeholder="Correo electrónico"
                                            value={value}
                                            onChangeText={onChange}
                                            label="Correo"
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
                                            value={value}
                                            onDateChange={onChange}
                                            placeholder="Seleccionar fecha"
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
                                            placeholder="Número de teléfono"
                                            value={value}
                                            onChangeText={onChange}
                                            label="Número de teléfono"
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
                                            placeholder="Contraseña"
                                            value={value}
                                            onChangeText={onChange}
                                            label="Contraseña"
                                            error={error?.message}
                                        />
                                    )}
                                />

                                <View className="flex-row w-full items-center pt-4 mb-6">
                                    <Controller
                                        control={control}
                                        name="remember"
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <View className='flex-col'>
                                                <View className='flex-row'>
                                                    <CustomInput
                                                        type="checkbox"
                                                        label="Estoy de acuerdo con los"
                                                        checked={value}
                                                        onCheckedChange={onChange}
                                                    />
                                                    <Text className="text-links-servilink ml-1">Términos</Text>
                                                    <Text className="text-white/90 ml-1">y</Text>
                                                    <Text className="text-links-servilink ml-1">condiciones</Text>
                                                </View>
                                                {error && (
                                                    <Text className="text-red-500 text-sm">{error.message}</Text>
                                                )}
                                            </View>
                                        )}
                                    />
                                </View>

                                <CustomButton
                                    className=""
                                    loading={loading}
                                    label="Registrar"
                                    onPress={handleSubmit(onSubmit)}
                                />

                                <View className="flex-row justify-center gap-2 w-full items-center pt-4">
                                    <Text className="text-white/90">¿Ya tienes una cuenta?</Text>
                                    <Link className="text-links-servilink" replace href="/auth/login">
                                        Inicia sesión
                                    </Link>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
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
