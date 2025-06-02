// /components/PaymentItem.tsx
import { auth } from '@/lib/firebaseConfig'; // asegúrate que apunta a tu instancia de auth
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = {
    amount: number
    status: string
    createdAt: Date
    contractId: string
    method: string
    metadata: {
        provider_id: string
        client_id: string
    }
    onPress?: () => void
}

export default function PaymentItem({
    amount,
    status,
    createdAt,
    contractId,
    method,
    metadata,
    onPress
}: Props) {
    const currentUid = auth.currentUser?.uid
    const isIngreso = metadata?.provider_id === currentUid

    return (
        <View className="border-links-servilink bg-primarybg-servilink border rounded-xl mb-4">
            <Pressable onPress={onPress} className="p-4" android_ripple={{ color: '#ffffff10' }}>
                <View className="flex-row items-center justify-between">
                    {/* Icono + info */}
                    <View className="flex-row items-center gap-4">
                        <View
                            className={`w-10 h-10 rounded-xl items-center justify-center ${isIngreso ? 'bg-green-100' : 'bg-red-100'
                                }`}
                        >
                            <Ionicons
                                name={isIngreso ? 'arrow-down-outline' : 'arrow-up-outline'}
                                size={20}
                                color={isIngreso ? '#22c55e' : '#ef4444'}
                            />
                        </View>

                        <View>
                            <Text className="text-white font-semibold">
                                Contrato {contractId?.slice(0, 5) ?? 'N/D'}...
                            </Text>
                            <Text className="text-gray-400 text-sm capitalize">
                                {method} - {status}
                            </Text>
                        </View>
                    </View>

                    {/* Monto + fecha */}
                    <View className="items-end">
                        <Text className={`font-semibold ${isIngreso ? 'text-green-400' : 'text-white'}`}>
                            ${amount / 100}
                        </Text>
                        <Text className="text-xs text-gray-500">
                            {createdAt.toLocaleDateString('es-MX', {
                                day: '2-digit',
                                month: 'short',
                                year: '2-digit'
                            })}
                        </Text>
                    </View>
                </View>
            </Pressable>
        </View>
    )
}
