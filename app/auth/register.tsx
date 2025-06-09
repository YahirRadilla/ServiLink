import { RegisterUserProps } from '@/features/auth/services';
import { useAuthStore } from '@/features/auth/store';
import { useAuth } from '@/features/auth/useAuth';
import { db } from '@/lib/firebaseConfig';
import { CustomButton } from '@/shared/components/CustomButton';
import CustomInput from '@/shared/components/CustomInput';
import { useToastStore } from '@/shared/toastStore';
import { yupResolver } from '@hookform/resolvers/yup';
import { BlurView } from 'expo-blur';
import { Link, router, useNavigation } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Dimensions, Modal, Pressable, ScrollView, Text, View } from 'react-native';
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
    const [isTermsVisible, setIsTermsVisible] = useState(false);


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
            const q = query(collection(db, "users"), where("phone_number", "==", data.phone));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                toast?.show("El número de teléfono ya está registrado", "error", 2000);
                return;
            }

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
                                                    <Pressable onPress={() => setIsTermsVisible(true)} className="flex-row">
                                                        <Text className="text-links-servilink ml-1">Términos</Text>
                                                        <Text className="text-white/90 ml-1">y</Text>
                                                        <Text className="text-links-servilink ml-1">condiciones</Text>
                                                    </Pressable>

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


            <Modal
                visible={isTermsVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsTermsVisible(false)}
            >
                <View className="flex-1 bg-black/80 justify-center items-center p-6">
                    <View className="bg-white rounded-xl p-6 max-w-md w-full">
                        <Text className="text-lg font-bold mb-4">Términos y Condiciones</Text>
                        <ScrollView className="mb-4" style={{ maxHeight: 300 }}>
                            <Text className="text-sm text-black" style={{ lineHeight: 20 }}>
                                {`TÉRMINOS Y CONDICIONES DE USO – SERVILINK\n\n`}

                                {`Última actualización: junio 2025\n\n`}

                                {`1. ACEPTACIÓN DE LOS TÉRMINOS\n`}
                                {`Al registrarte o utilizar la plataforma, aceptas cumplir con los presentes Términos y Condiciones. Si no estás de acuerdo, no debes usar el servicio.\n\n`}

                                {`2. REGISTRO DE CUENTA\n`}
                                {`Debes proporcionar información veraz, actualizada y completa al momento de registrarte. Está prohibido usar datos falsos o suplantar a terceros.\n\n`}

                                {`3. USO DE LA PLATAFORMA\n`}
                                {`- Los usuarios pueden solicitar servicios, calificar proveedores y gestionar contratos.\n`}
                                {`- Los proveedores pueden ofrecer servicios, responder a propuestas y administrar sus perfiles.\n`}
                                {`- Queda prohibido el uso de la plataforma para fines ilegales o no autorizados.\n\n`}

                                {`4. CONTRATACIÓN DE SERVICIOS\n`}
                                {`Toda relación contractual generada dentro de la plataforma es responsabilidad de las partes involucradas. ServiLink no se hace responsable de incumplimientos entre usuario y proveedor.\n\n`}

                                {`5. PAGOS\n`}
                                {`Si la plataforma implementa pagos en línea, estos serán gestionados mediante un proveedor externo y estarán sujetos a sus propios términos.\n\n`}

                                {`6. CONTENIDO Y COMPORTAMIENTO\n`}
                                {`Los usuarios se comprometen a:\n`}
                                {`- No publicar contenido ofensivo, discriminatorio o fraudulento.\n`}
                                {`- No acosar a otros usuarios o proveedores.\n`}
                                {`- No manipular calificaciones o comentarios.\n\n`}

                                {`7. SUSPENSIÓN Y CANCELACIÓN\n`}
                                {`Nos reservamos el derecho de suspender o eliminar cuentas que infrinjan estos términos o hagan mal uso del sistema.\n\n`}

                                {`8. PRIVACIDAD\n`}
                                {`Tus datos personales serán tratados conforme a nuestra Política de Privacidad. No compartiremos tu información sin tu consentimiento, salvo requerimiento legal.\n\n`}

                                {`9. MODIFICACIONES\n`}
                                {`Estos términos pueden actualizarse ocasionalmente. Te notificaremos de cambios importantes mediante la aplicación o tu correo electrónico registrado.\n\n`}

                                {`10. CONTACTO\n`}
                                {`Para dudas o reclamos, contáctanos a través del correo: soporte@servilink.com\n`}
                            </Text>

                        </ScrollView>
                        <CustomButton
                            label="Cerrar"
                            onPress={() => setIsTermsVisible(false)}
                        />
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}
