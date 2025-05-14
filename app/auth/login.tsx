import { CustomButton } from '@/shared/components/CustomButton';
import CustomInput from '@/shared/components/CustomInput';
import { GoogleLoginButton } from '@/shared/components/GoogleLoginButton';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore
import Logo from '../../shared/svg/logo.svg';



export default function LoginScreen() {
    const { height } = Dimensions.get('window');

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [remember, setRemember] = React.useState(false);

    const handleClick = () => {
        console.log(email, password, remember);
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

                            <GoogleLoginButton onPress={() => console.log('object')} />

                            <View className="flex-row w-full items-center justify-between gap-x-2">
                                <View className="h-[1px] w-20 bg-white/90" />
                                <Text className='text-center text-white/90'>O inicia sesión con</Text>
                                <View className="h-[1px] w-20 bg-white/90" />
                            </View>

                            <View className="w-full">
                                <CustomInput
                                    type="email"
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChangeText={setEmail}
                                    label='Correo'
                                />
                                <CustomInput
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChangeText={setPassword}
                                    label='Contraseña'
                                />
                                <View className='flex-row justify-between w-full items-center pt-4'>
                                    <CustomInput
                                        type="checkbox"
                                        label="Recuerdame"
                                        checked={remember}
                                        onCheckedChange={setRemember}
                                    />
                                    <Link className='text-links-servilink' href="/forgotPassword">¿Olvidó su contraseña?</Link>
                                </View>


                                <CustomButton
                                    className='mt-6'
                                    label="Iniciar sesión"
                                    onPress={() => handleClick()}
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
        </SafeAreaView>






    )
}