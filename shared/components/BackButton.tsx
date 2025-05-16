import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

export default function BackButton() {
    const router = useNavigation();

    const handleBack = () => {
        router.goBack();
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
