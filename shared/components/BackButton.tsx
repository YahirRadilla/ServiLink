import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // ✅ esta sí tiene push, replace, etc.
import React from 'react';
import { Pressable } from 'react-native';

type BackButtonProps = {
  fallbackToHome?: boolean;
};

export default function BackButton({ fallbackToHome  }: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        if(fallbackToHome || !router.canGoBack()) {
            router.replace("/(app)/(tabs)");
        }else{
            router.back();
        }
    };

    return (
        <Pressable onPress={() => handleBack()}>
            <Ionicons
                name={"chevron-back-outline"}
                size={26}
                color={"#eff0f6"}
            />
        </Pressable>
    );
}
