import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';

interface CustomInputProps extends TextInputProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'checkbox';
    placeholder?: string;
    className?: string;
    label?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

export default function CustomInput({
    type = 'text',
    placeholder,
    className,
    label,
    checked = false,
    onCheckedChange,
    ...rest
}: CustomInputProps) {
    const [isHidden, setIsHidden] = useState(type === 'password');
    const isPassword = type === 'password';
    const isCheckbox = type === 'checkbox';

    const keyboardType =
        type === 'email' ? 'email-address' :
            type === 'number' ? 'numeric' : 'default';

    if (isCheckbox) {
        return (
            <Pressable
                onPress={() => onCheckedChange?.(!checked)}
                className="flex-row items-center gap-x-2 pt-4"
            >
                <View
                    className={`w-5 h-5 rounded border border-auth-border-servilink items-center justify-center ${checked ? 'bg-primary-servilink border-primary-servilink' : ''
                        }`}
                >
                    {checked && (
                        <Ionicons name="checkmark" size={14} color="white" />
                    )}
                </View>
                <Text className="text-white/90">{label}</Text>
            </Pressable>
        );
    }

    return (
        <View className="gap-y-2">
            {label && <Text className="text-white/90 pt-4">{label}</Text>}

            <View className="relative w-full">
                <TextInput
                    className={`w-full px-4 py-3 rounded-xl bg-transparent text-white/90 border border-auth-border-servilink pr-12`}
                    placeholder={placeholder}
                    placeholderTextColor="#888"
                    secureTextEntry={isPassword && isHidden}
                    keyboardType={keyboardType}
                    autoCapitalize={type === 'email' ? 'none' : 'sentences'}
                    {...rest}
                />

                {isPassword && (
                    <Pressable
                        onPress={() => setIsHidden(!isHidden)}
                        className="absolute right-4 top-0 bottom-0 justify-center"
                    >
                        <Ionicons
                            name={isHidden ? 'eye-off-outline' : 'eye-outline'}
                            size={22}
                            color="#888"
                        />
                    </Pressable>
                )}
            </View>
        </View>
    );
}
