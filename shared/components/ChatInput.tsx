import { uploadFileToStorage } from "@/features/inbox/uploadFileToStorage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

interface ChatInputProps {
    onSend: (content: string, type: "text" | "image" | "video") => void;
}

const ChatInput = ({ onSend }: ChatInputProps) => {
    const [message, setMessage] = useState("");
    const [media, setMedia] = useState<
        { uri: string; type: "image" | "video" }[]
    >([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (media.length > 0) {
            setLoading(true);
            const itemsToSend = [...media];
            setMedia([]);
            for (const item of itemsToSend) {
                const url = await uploadFileToStorage(
                    item.uri,
                    item.type === "image" ? "chat-images" : "chat-videos"
                );
                onSend(url, item.type);
            }
            setMedia([]);
            setLoading(false);
        }

        if (message.trim()) {
            setLoading(true);
            onSend(message.trim(), "text");
            setMessage("");
            setLoading(false);
        }
    };

    const removeMedia = (uri: string) => {
        setMedia((prev) => prev.filter((item) => item.uri !== uri));
    };

    const pickMedia = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            const selectedMedia = result.assets.map((asset) => ({
                uri: asset.uri,
                type: asset.type as "image" | "video",
            }));
            setMedia((prev) => [...prev, ...selectedMedia]);
        }
    };

    return (
        <View className="px-3 pt-2 pb-3 bg-[#0F0F1A] border-t border-white/10">
            {/* Previews */}
            {media.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-2"
                >
                    {media.map((item) => (
                        <View key={item.uri} className="relative mr-2">
                            {item.type === "image" ? (
                                <Image
                                    source={{ uri: item.uri }}
                                    className="w-20 h-20 rounded-lg"
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="w-20 h-20 rounded-lg bg-black/40 justify-center items-center">
                                    <Ionicons name="videocam-outline" size={28} color="white" />
                                    <Text className="text-white text-xs mt-1">Video</Text>
                                </View>
                            )}

                            <Pressable
                                onPress={() => removeMedia(item.uri)}
                                className="absolute -top-2 -right-2 bg-black/70 rounded-full p-1"
                            >
                                <Ionicons name="close" size={14} color="#fff" />
                            </Pressable>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Input + acciones */}
            <View className="flex-row items-center justify-between bg-[#131323] rounded-2xl border border-[#3D5DC7] px-4 py-3">
                <Pressable
                    onPress={pickMedia}
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
                    android_ripple={{
                        color: "#ffffff10",
                        borderless: false,
                        radius: 20,
                    }}
                >
                    {loading ? (
                        <Ionicons name="hourglass" size={22} color="#FFF" />
                    ) :
                        <Ionicons name="send" size={22} color="#FFF" />
                    }
                </Pressable>
            </View>
        </View>
    );
};

export default ChatInput;
