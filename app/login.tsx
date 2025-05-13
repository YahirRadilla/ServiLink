import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomInput from '@/shared/components/CustomInput';
import { GoogleLoginButton } from '@/shared/components/GoogleLoginButton';
// @ts-ignore
import Logo from '../shared/svg/logo.svg';


export default function LoginScreen() {
    const { height } = Dimensions.get('window');
    const navigation = useNavigation();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [remember, setRemember] = React.useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    return (

        <SafeAreaView className='flex-1 bg-primarybg-servilink gap-y-14'>


            <View style={{ height: height / 2.2 }} className="w-full bg-neutral800 absolute top-0 z-1" />


            <View className="w-full flex-col items-center gap-2 pt-5 z-10">
                <Logo />
                <Text className="text-center text-white text-3xl font-bold">Inicia sesión en</Text>
                <Text className="text-center text-white text-3xl font-bold">tu cuenta</Text>
                <Text className="text-center text-white/90">
                    Ingresa tu correo y contraseña para entrar
                </Text>
            </View>


            <View className='items-center'>
                <View className="w-96 flex-col items-center gap-y-5 z-0 bg-primarybg-servilink p-6 rounded-xl shadow-md shadow-white">

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
                        <CustomInput
                            type="checkbox"
                            label="Recuerdame"
                            checked={remember}
                            onCheckedChange={setRemember}
                        />
                    </View>

                </View>
            </View>



        </SafeAreaView>






    )
}