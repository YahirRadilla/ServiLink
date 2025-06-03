import { useAuth } from '@/features/auth/useAuth';
import { CustomButton } from '@/shared/components/CustomButton';
import CustomInput from '@/shared/components/CustomInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { BlurView } from 'expo-blur';
import { Link, router, Stack } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { useGoogleLogin } from '@/features/auth/useGoogleAuth';

import { useAuthStore } from '@/features/auth/store';
import { GoogleLoginButton } from '@/shared/components/GoogleLoginButton';
import { useToastStore } from '@/shared/toastStore';
// @ts-ignore
import Logo from '../../shared/svg/logo.svg';

const schema = Yup.object({
    email: Yup.string().email('Correo inválido').required('Campo requerido'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Campo requerido'),
});


export default function LoginScreen() {
    const { height } = Dimensions.get('window');
    const toast = useToastStore((s) => s.toastRef);

    const [remember, setRemember] = React.useState(false);

    const { login } = useAuth();
    const { loginWithGoogle } = useGoogleLogin();
    const loading = useAuthStore((state) => state.isLoading);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: 'yahirradi@hotmail.com',
            password: '123456',
        },
    });

    const handleClick = async (data: any) => {
        try {
            await login(data.email, data.password);
            toast?.show("Inicio de sesión exitoso", "success", 1500);
            router.replace('/(app)/(tabs)');
        } catch (error) {
            toast?.show("Credenciales invalidas", "error", 2000);
            console.log(error);
        }
    }



    return (

        <SafeAreaView className='flex-1 bg-primarybg-servilink gap-y-14'>
            <Stack.Screen
                options={{
                    headerShown: false,
                    title: 'Recuperar contraseña',
                }}
            />
            <View style={{ height: height / 2.2 }} className="w-full bg-neutral800 absolute top-0 z-1" />
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,

                    paddingVertical: 24,
                }}
                keyboardShouldPersistTaps="handled"
            >


                <View className="gap-y-10">
                    <View className="w-full flex-col items-center gap-2 pt-5 z-10">
                        <Logo />
                        <Text className="text-center text-white text-3xl font-bold">Inicia sesión en</Text>
                        <Text className="text-center text-white text-3xl font-bold">tu cuenta</Text>
                        <Text className="text-center text-white/90">
                            Ingresa tu correo y contraseña para entrar
                        </Text>
                    </View>


                    <View className='items-center'>
                        <View className="w-[95%] flex-col items-center gap-y-5 z-0 bg-primarybg-servilink p-6 rounded-xl shadow-md shadow-white">

                            <GoogleLoginButton onPress={() => loginWithGoogle()} />

                            <View className="flex-row w-full items-center justify-between gap-x-2">
                                <View className="h-[1px] w-20 bg-white/90" />
                                <Text className='text-center text-white/90'>O inicia sesión con</Text>
                                <View className="h-[1px] w-20 bg-white/90" />
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
                                <View className='flex-row justify-between w-full items-center pt-4 mb-6'>
                                    <CustomInput
                                        type="checkbox"
                                        label="Recuerdame"
                                        checked={remember}
                                        onCheckedChange={setRemember}
                                    />
                                    <Link className='text-links-servilink' href="/forgotPassword">¿Olvidó su contraseña?</Link>
                                </View>


                                <CustomButton
                                    className=''
                                    loading={loading}
                                    label="Iniciar sesión"
                                    onPress={handleSubmit(handleClick)}
                                />

                                <View className='flex-row justify-center gap-2 w-full items-center pt-4'>
                                    <Text className='text-white/90'>¿No tienes una cuenta?</Text>
                                    <Link className='text-links-servilink' replace href="/auth/register">Registrate</Link>
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






    )
}