import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable, Text, TextInput, TextInputProps, View } from 'react-native';

interface CustomInputProps extends TextInputProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'checkbox' | 'date';
    placeholder?: string;
    className?: string;
    label?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    onDateChange?: (date: Date) => void;
    value?: any;
    error?: string;
}

export default function CustomInput({
    type = 'text',
    placeholder,
    className,
    label,
    checked = false,
    onCheckedChange,
    onDateChange,
    value,
    error,
    ...rest
}: CustomInputProps) {
    const [isHidden, setIsHidden] = useState(type === 'password');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const isPassword = type === 'password';
    const isCheckbox = type === 'checkbox';
    const isDate = type === 'date';

    const keyboardType =
        type === 'email' ? 'email-address' :
            type === 'number' ? 'numeric' : 'default';

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            onDateChange?.(selectedDate);
        }
    };

    if (isCheckbox) {
        return (
            <Pressable
                onPress={() => onCheckedChange?.(!checked)}
                className="flex-row items-center gap-x-2"
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

    if (isDate) {
        return (
            <View className="gap-y-2">
                {label && <Text className="text-white/90 pt-4">{label}</Text>}

                <View className="relative w-full">
                    <Pressable
                        onPress={() => setShowDatePicker(true)}
                        className={`w-full px-4 py-3 rounded-xl bg-transparent border ${error ? 'border-red-500' : 'border-auth-border-servilink'} flex-row justify-between items-center`}
                    >
                        <Text className={`text-white/50 ${!value ? 'italic' : ''}`}>
                            {value ? new Date(value).toLocaleDateString() : placeholder || 'Seleccionar fecha'}
                        </Text>
                        <Ionicons name="calendar-outline" size={22} color="#888" />
                    </Pressable>

                    {showDatePicker && (
                        <DateTimePicker
                            value={value || new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                </View>

                {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
            </View>
        );
    }

    return (
        <View className="gap-y-2">
            {label && <Text className="text-white/90 pt-4">{label}</Text>}

            <View className="relative w-full">
                <TextInput
                    className={`w-full px-4 py-3 rounded-xl bg-transparent text-white/90 border ${error ? 'border-red-500' : 'border-auth-border-servilink'} pr-12`}
                    placeholder={placeholder}
                    placeholderTextColor="#888"
                    secureTextEntry={isPassword && isHidden}
                    keyboardType={keyboardType}
                    autoCapitalize={type === 'email' ? 'none' : 'sentences'}
                    value={value}
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

            {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
        </View>
    );
}
