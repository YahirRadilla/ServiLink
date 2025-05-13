import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function LoginScreen() {
    const { height } = Dimensions.get('window');

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    return (

        <SafeAreaView className='flex-1 bg-primarybg-servilink gap-y-14'>


            <View style={{ height: height / 2.4 }} className="w-full bg-neutral800 absolute top-0 z-1" />


            <View className="w-full flex-col items-center gap-2 pt-5 z-10">

                <Text className="text-center text-white text-3xl font-bold">Inicia sesión en</Text>
                <Text className="text-center text-white text-3xl font-bold">tu cuenta</Text>
                <Text className="text-center text-white/90">
                    Ingresa tu correo y contraseña para entrar
                </Text>
            </View>


            <View className='items-center'>
                <View className="w-96 flex-col items-center gap-2 pt-5 z-0 bg-primarybg-servilink p-4 rounded-xl shadow-md shadow-white">


                    <Text className="text-center text-white text-3xl font-bold">Inicia sesión en</Text>
                    <Text className="text-center text-white text-3xl font-bold">tu cuenta</Text>
                    <Text className="text-center text-white/90">
                        Ingresa tu correo y contraseña para entrar
                    </Text>
                </View>
            </View>



        </SafeAreaView>






    )
}