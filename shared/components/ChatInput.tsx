import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

interface ChatInputProps {
    onSend: (text: string) => void;
    onPickImage?: () => void;
}

const ChatInput = ({ onSend, onPickImage }: ChatInputProps) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (!message.trim()) return;
        onSend(message);
        setMessage("");
    };

    return (
        <View className="flex-row items-center justify-between bg-[#131323] rounded-2xl border border-[#3D5DC7] px-4 py-3 mx-3 mb-3">
            <Pressable
                onPress={onPickImage}
                android_ripple={{ color: "#ffffff10", borderless: true, radius: 20 }}
            >
                <Ionicons name="image-outline" size={24} color="#FFF" />
            </Pressable>

            <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Aa"
                placeholderTextColor="#999"
                className="flex-1 px-4 text-white text-base"
                multiline
            />

            <Pressable
                onPress={handleSend}
                android_ripple={{ color: "#ffffff10", borderless: false, radius: 20 }}
            >
                <Ionicons name="send" size={22} color="#FFF" />
            </Pressable>
        </View>
    );
};

export default ChatInput;
