import { SingleEntityScreen } from '@/components/SingleEntityScreen'
import { usePaymentStore } from '@/features/payments/store'
import { auth } from '@/lib/firebaseConfig'
import BackButton from '@/shared/components/BackButton'
import PaymentItem from '@/shared/components/PaymentItem'
import { Stack, useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import React, { useEffect } from 'react'
import { FlatList, Text, View } from 'react-native'

export default function PaymentHistoryScreen() {
    const { payments, fetchPayments, isLoading } = usePaymentStore()

    const currentUid = auth.currentUser?.uid

    const visiblePayments = payments.filter(
        (p) => p.clientId === currentUid || p.providerId === currentUid
    )

    console.log(payments);
    const router = useRouter()

    useEffect(() => {
        fetchPayments()
    }, [])

    const handleTouchContract = (id: string) => {
        if (!id) return;
        router.push({
            pathname: "/contract/[id]",
            params: { id },
        });
    };

    if (isLoading || !payments) {
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
                        Cargando pagos...
                    </Text>
                </View>
            </SingleEntityScreen>
        );
    }


    return (
        <View className="flex-1 bg-gray-900 p-4 pt-16">
            <Stack.Screen options={{ headerShown: false }} />
            <View className="flex-row items-center space-x-4 mb-4">
                <View className="bg-black/50 p-2 rounded-full">
                    <BackButton />
                </View>
                <Text className="text-white text-2xl font-bold">Historial de Pagos</Text>
            </View>

            <FlatList
                data={visiblePayments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PaymentItem
                        amount={item.amount}
                        status={item.status}
                        createdAt={item.createdAt}
                        contractId={item.contractId}
                        method={item.method}
                        metadata={{ provider_id: item.providerId, client_id: item.clientId }}
                        onPress={() => handleTouchContract(item.contractId)}
                    />
                )}
                ListEmptyComponent={
                    <Text className="text-center text-gray-400 mt-8">No hay pagos registrados.</Text>
                }
            />


        </View>
    )
}
