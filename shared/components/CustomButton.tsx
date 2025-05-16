import React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';

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
        <Pressable
            className={`px-4 py-3 rounded-xl items-center ${baseStyles} ${className}`}
            onPress={onPress}
            disabled={variant === 'disabled'}
            {...rest}
        >
            <Text className="text-white text-base font-medium">{label}</Text>
        </Pressable>
    )
}