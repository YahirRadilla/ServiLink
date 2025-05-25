import { SingleEntityScreen } from "@/components/SingleEntityScreen";
import { getUserByRef, TUser, useUserStore } from "@/entities/users";
import { sendMessage } from "@/features/inbox/service";
import { useMessages } from "@/features/inbox/useMessage";
import { db } from "@/lib/firebaseConfig";
import BackButton from "@/shared/components/BackButton";
import ChatInput from "@/shared/components/ChatInput";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { ResizeMode, Video } from "expo-av";
import { Stack, useLocalSearchParams } from "expo-router";
import { doc } from "firebase/firestore";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import EnhancedImageViewing from "react-native-image-viewing";



const ChatScreen = () => {
    const user = useUserStore((state) => state.user);
    const { id: conversationId, conversationReceiver } = useLocalSearchParams();
    const { messages } = useMessages(conversationId as string);
    const [userReceiver, setUserReceiver] = useState<TUser | null>(null);
    const [viewerVisible, setViewerVisible] = useState(false);
    const [mediaToView, setMediaToView] = useState<{ uri: string; type: "image" | "video" } | null>(null);


    useEffect(() => {
        if (!conversationReceiver) return
        const conversationReceiverRef = doc(db, "users", conversationReceiver as string);
        getUserByRef(conversationReceiverRef).then((user) => setUserReceiver(user));
    }, []);

    const handleSend = async (content: string, type: "text" | "image" | "video") => {
        if (!content.trim()) return;

        await sendMessage({
            content,
            type,
            seen: false,
            sender_id: doc(db, "users", user!.id),
            conversation_id: doc(db, "conversations", conversationId as string),
        });
    };


    const renderItem = ({ item }: any) => {
        const isOwn = item.sender_id.id === user!.id;
        const messageStyle = isOwn
            ? "bg-[#3D5DC7] ml-auto rounded-tr-none"
            : "bg-[#1A1A2F] mr-auto border border-gray-600 rounded-tl-none";

        return (
            <Pressable
                onPress={() => {
                    if (item.type === "image" || item.type === "video") {
                        setMediaToView({ uri: item.content, type: item.type });
                        setViewerVisible(true);
                    }
                }}
                className={`max-w-[80%] rounded-xl px-4 py-2 my-1 ${messageStyle}`}
            >
                {item.type === "image" && (
                    <Image source={{ uri: item.content }} className="w-52 h-52 rounded-2xl" />
                )}
                {item.type === "video" && (
                    <Video
                        source={{ uri: item.content }}
                        className="w-52 h-52 rounded-2xl"
                        useNativeControls
                        resizeMode={ResizeMode.COVER}
                        isLooping
                    />
                )}
                {item.type === "text" && (
                    <Text className="text-sm text-white">{item.content}</Text>
                )}
                <Text className="text-[10px] text-right text-gray-400 mt-1">
                    {dayjs(item.date?.toDate?.() || new Date()).format("h:mm A")}
                </Text>
            </Pressable>
        );
    };


    if (!userReceiver) {
        return (
            <SingleEntityScreen>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 justify-center items-center bg-primarybg-servilink px-4">
                    <LottieView
                        source={require("@/assets/animations/loading.json")}
                        autoPlay
                        loop
                        style={{ width: 120, height: 120 }}
                    />
                    <Text className="text-white/60 mt-4 text-base">
                        Cargando Chat...
                    </Text>
                </View>
            </SingleEntityScreen>
        );
    }

    return (
        <SingleEntityScreen>

            <Stack.Screen options={{ headerShown: false }} />
            <View className="flex-row items-center justify-between w-full p-4">
                <View className="flex-row items-center">
                    <View className="bg-black/50 p-2 rounded-full mr-2">
                        <BackButton />
                    </View>
                    <Image source={{ uri: userReceiver?.imageProfile || "https://firebasestorage.googleapis.com/v0/b/servilink-68398.firebasestorage.app/o/user-placeholder.png?alt=media&token=f1ee8fe8-276f-4b86-9ee9-ffce09655e01" }} className="w-10 h-10 rounded-full mr-2" />
                    <Text numberOfLines={2} style={{ maxWidth: "70%" }} ellipsizeMode="tail" className="font-semibold text-lg text-white">{userReceiver?.name} {userReceiver?.lastname} </Text>
                </View>

            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        inverted
                        contentContainerStyle={{ padding: 12, flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}

                    />
                </TouchableWithoutFeedback>
                <View className="mb-3">
                    <ChatInput onSend={handleSend} />

                </View>
            </KeyboardAvoidingView>
            {viewerVisible && mediaToView && mediaToView.type === "image" && (
                <EnhancedImageViewing
                    images={[{ uri: mediaToView.uri }]}
                    imageIndex={0}
                    visible={viewerVisible}
                    onRequestClose={() => setViewerVisible(false)}
                />
            )}

            {viewerVisible && mediaToView?.type === "video" && (
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/95 justify-center items-center z-50">
                    <Video
                        source={{ uri: mediaToView.uri }}
                        useNativeControls
                        resizeMode={ResizeMode.COVER}
                        style={{ width: "100%", height: "60%" }}
                        shouldPlay
                    />
                    <Pressable onPress={() => setViewerVisible(false)} className="absolute top-8 right-6">
                        <Ionicons name="close" size={30} color="white" />
                    </Pressable>
                </View>
            )}

        </SingleEntityScreen>
    );
};

export default ChatScreen;
