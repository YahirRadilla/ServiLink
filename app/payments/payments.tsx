import { usePaymentStore } from '@/features/payments/store'
import BackButton from '@/shared/components/BackButton'
import { Stack } from 'expo-router'
import React, { useEffect } from 'react'
import { FlatList, Text, View } from 'react-native'

export default function PaymentHistoryScreen() {
    const { payments, fetchPayments } = usePaymentStore()

    useEffect(() => {
        fetchPayments()
    }, [])

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
                data={payments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="bg-gray-800 rounded-2xl p-4 mb-4">
                        <Text className="text-white text-lg font-semibold">
                            ${item.amount / 100} MXN
                        </Text>
                        <Text className="text-gray-400">Método: {item.method}</Text>
                        <Text className="text-gray-400">Estado: {item.status}</Text>
                        <Text className="text-gray-500 text-sm">
                            Fecha: {item.createdAt?.toLocaleDateString()}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text className="text-center text-gray-400 mt-8">No hay pagos registrados.</Text>
                }
            />
        </View>
    )
}
