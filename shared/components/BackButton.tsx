import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

interface BackButtonProps {
  onPress?: () => void;
}

export default function BackButton( {onPress}: BackButtonProps) {
    const router = useNavigation();

    const handleBack = () => {
        if (onPress) {
            onPress();
            return;
        }
        else {
            router.goBack();
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
