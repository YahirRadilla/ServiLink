import React from 'react';
import { Pressable, PressableProps, Text, View } from 'react-native';

interface CustomButtonProps extends PressableProps {
    label: string;
    variant?: 'primary' | 'disabled';
    className?: string;
}

export function CustomButton({
    label,
    onPress,
    variant = 'primary',
    className,
    ...rest
}: CustomButtonProps) {
    const baseStyles = variant === 'disabled' ? 'bg-gray-400' : 'bg-primary-servilink';


    return (
        <View className={`overflow-hidden rounded-xl`}>
            <Pressable
                className={`px-4 py-3 items-center ${baseStyles} ${className}`}
                onPress={onPress}
                android_ripple={{ color: "#ffffff10" }}
                disabled={variant === 'disabled'}
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                {...rest}
            >
                <Text className="text-white text-base font-medium">{label}</Text>
            </Pressable>
        </View>
    )
}