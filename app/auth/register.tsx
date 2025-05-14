import { CustomButton } from '@/shared/components/CustomButton';
import CustomInput from '@/shared/components/CustomInput';
import { Link, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// @ts-ignore
import Logo from '../../shared/svg/logo.svg';

export default function RegisterScreen() {
    const { height } = Dimensions.get('window');
    const navigation = useNavigation();

    const [name, setName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [birthDate, setBirthDate] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [remember, setRemember] = React.useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    return (

        <SafeAreaView className='flex-1 bg-primarybg-servilink gap-y-14'>


            <View style={{ height: height / 2.4 }} className="w-full bg-neutral800 absolute top-0 z-1" />

            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingVertical: 24,
                }}
                keyboardShouldPersistTaps="handled"
            >


                <View className="gap-y-10">
                    <View className="w-full flex-col items-center gap-2 pt-5 z-10 ">
                        <Logo />
                        <View className="h-4" />
                        <Text className="text-center text-white text-3xl font-bold ">Registrar una cuenta</Text>
                    </View>


                    <View className='items-center '>
                        <View className="w-[95%] max-w-md flex-col items-center  z-0 bg-primarybg-servilink p-4 rounded-xl shadow-md shadow-white">


                            <View className="w-full flex-row gap-2">
                                <View className="flex-1">
                                    <CustomInput
                                        type="text"
                                        placeholder="Nombre"
                                        value={name}
                                        onChangeText={setName}
                                        label="Nombre"
                                    />
                                </View>
                                <View className="flex-1">
                                    <CustomInput
                                        type="text"
                                        placeholder="Apellido"
                                        value={lastName}
                                        onChangeText={setLastName}
                                        label="Apellido"
                                    />
                                </View>
                            </View>
                            <View className="w-full" >
                                <CustomInput
                                    type="email"
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChangeText={setEmail}
                                    label="Correo"
                                />
                                {/* <CustomInput
                            type="text"
                            placeholder="DD/MM/AAAA"
                            value={birthDate}
                            onChangeText={setBirthDate}
                            label="Fecha de nacimiento" 
                        /> */}
                                <CustomInput
                                    type="number"
                                    placeholder="Número de teléfono"
                                    value={phone}
                                    onChangeText={setPhone}
                                    label="Número de teléfono"
                                />
                                <CustomInput
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChangeText={setPassword}
                                    label="Contraseña"
                                />
                                <View className='flex-row w-full items-center pt-4'>
                                    <CustomInput
                                        type="checkbox"
                                        label="Estoy de acuerdo con los"
                                        checked={remember}
                                        onCheckedChange={setRemember}
                                    />
                                    <Text className='text-links-servilink ml-2'>Terminos</Text>
                                    <Text className='text-white/90 ml-2'>y</Text>
                                    <Text className='text-links-servilink ml-2'>condiciones</Text>
                                </View>

                                <CustomButton
                                    className='mt-6'
                                    label="Registrar"
                                    onPress={() => console.log('Registrando cuenta')}
                                />

                                <View className='flex-row justify-center gap-2 w-full items-center pt-4'>
                                    <Text className='text-white/90'>¿Ya tienes una cuenta?</Text>
                                    <Link className='text-links-servilink' replace href="/auth/login">Inicia sesión</Link>
                                </View>
                            </View>

                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}