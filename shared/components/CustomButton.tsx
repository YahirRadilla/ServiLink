import React from 'react';
import { Pressable, PressableProps, Text, View } from 'react-native';

interface CustomButtonProps extends PressableProps {
    label?: string;
    icon?: React.ReactNode;
    variant?: 'primary' | 'disabled';
    className?: string;
    loading?: boolean;
}

export function CustomButton({
    label,
    icon,
    onPress,
    variant = 'primary',
    className,
    loading = false,
    ...rest
}: CustomButtonProps) {
    const baseStyles = variant === 'disabled' ? 'bg-gray-400' : 'bg-primary-servilink';
    const disabledStyles = 'bg-gray-400';
    return (
        <View className="overflow-hidden rounded-xl">
            <Pressable
                className={`px-4 py-3 items-center justify-center ${loading ? disabledStyles : baseStyles} ${className}`}
                onPress={onPress}
                android_ripple={{ color: "#ffffff10" }}
                disabled={loading || variant === 'disabled'}
                style={({ pressed }) => [{ opacity: loading ? 0.5 : pressed ? 0.8 : 1, transitionDuration: '200' }]}
                {...rest}
            >
                {icon ? (
                    icon
                ) : (
                    <Text className="text-white/80 text-base font-medium">
                        {loading ? 'Cargando...' : label}
                    </Text>
                )}
            </Pressable>
        </View>
    );
}
