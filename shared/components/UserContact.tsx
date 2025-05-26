import { useUserStore } from '@/entities/users';
import { createConversationIfNotExists } from '@/features/inbox/service';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

type UserContactProps = {
    provider: any
    showStartChat?: boolean
}


export function UserContact({ provider, showStartChat = true }: UserContactProps) {

    const user = useUserStore((state) => state.user);
    const router = useRouter();

    const handleNewConversation = async () => {
        if (!user?.id || !provider?.id) return;

        const conversationId = await createConversationIfNotExists(
            user.profileStatus === "client" ? user.id : provider.id,
            user.profileStatus === "provider" ? user.id : provider.id
        );

        router.push({
            pathname: "/inbox/[id]",
            params: {
                id: conversationId,
                conversationReceiver: provider.id,
            },
        });
    };

    return (
        <View className="flex-row items-center gap-x-4 justify-between">
            <View className="flex-row items-center">
                <Image
                    source={{ uri: provider.imageProfile || "https://firebasestorage.googleapis.com/v0/b/servilink-68398.firebasestorage.app/o/user-placeholder.png?alt=media&token=f1ee8fe8-276f-4b86-9ee9-ffce09655e01" }}
                    className="w-10 h-10 rounded-full mr-3"
                    resizeMode="cover"
                    alt="Imagen de perfil"
                />
                <View>
                    <Text className="font-semibold text-lg text-white">{provider?.name}</Text>
                    <Text className="text-xs text-white/60">{provider?.email}</Text>
                </View>
            </View>
            {
                showStartChat && (
                    <Pressable onPress={handleNewConversation}>
                        <View className="bg-links-servilink p-2 rounded-md">
                            <Ionicons
                                name={"chatbubble"}
                                size={18}
                                color={"#fff"}
                            />
                        </View>
                    </Pressable>
                )
            }

        </View>
    )
}