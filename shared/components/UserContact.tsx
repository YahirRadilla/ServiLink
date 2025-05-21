import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

type UserContactProps = {
    provider: any
}


export function UserContact(provider: UserContactProps) {
    const { provider: user } = provider
    return (
        <View className="flex-row items-center gap-x-4 justify-between">
            <View className="flex-row items-center">
                <Image
                    source={{ uri: user.imageProfile || "https://firebasestorage.googleapis.com/v0/b/servilink-68398.firebasestorage.app/o/user-placeholder.png?alt=media&token=f1ee8fe8-276f-4b86-9ee9-ffce09655e01" }}
                    className="w-10 h-10 rounded-full mr-3"
                    resizeMode="cover"
                    alt="Imagen de perfil"
                />
                <View>
                    <Text className="font-semibold text-lg text-white">{user?.name}</Text>
                    <Text className="text-xs text-white/60">{user?.email}</Text>
                </View>
            </View>
            <Pressable>
                <View className="bg-links-servilink p-2 rounded-md">
                    <Ionicons
                        name={"chatbubble"}
                        size={18}
                        color={"#fff"}
                    />
                </View>
            </Pressable>
        </View>
    )
}