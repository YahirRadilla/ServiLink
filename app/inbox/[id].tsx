import { SingleEntityScreen } from "@/components/SingleEntityScreen";
import { useUserStore } from "@/entities/users";
import { sendMessage } from "@/features/inbox/service";
import { useMessages } from "@/features/inbox/useMessage";
import { db } from "@/lib/firebaseConfig";
import ChatInput from "@/shared/components/ChatInput";
import dayjs from "dayjs";
import { Stack, useLocalSearchParams } from "expo-router";
import { doc } from "firebase/firestore";
import { useState } from "react";
import {
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

const ChatScreen = () => {
    const user = useUserStore((state) => state.user);
    const { id: conversationId } = useLocalSearchParams();
    const { messages } = useMessages(conversationId as string);
    const [text, setText] = useState("");

    const handleSend = async (message: string) => {

        if (!message.trim()) return;

        await sendMessage({
            content: message,
            type: "text",
            seen: false,
            sender_id: doc(db, "users", user!.id),
            conversation_id: doc(db, "conversations", conversationId as string),
        });
    };


    const renderItem = ({ item }: any) => {
        const isOwn = item.sender_id.id === user!.id;
        const messageStyle = isOwn
            ? "bg-[#3D5DC7] ml-auto"
            : "bg-[#1A1A2F] mr-auto border border-gray-600";

        return (
            <View className={`max-w-[80%] rounded-2xl px-4 py-2 my-1 ${messageStyle}`}>

                {item.type === "image" ? <Image src={item.content} className="w-52 h-52 rounded-2xl" /> : <Text className="text-sm text-white">{item.content}</Text>}

                <Text className="text-[10px] text-right text-gray-400 mt-1">
                    {dayjs(item.date?.toDate?.() || new Date()).format("h:mm A")}
                </Text>
            </View>
        );
    };

    return (
        <SingleEntityScreen>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, backgroundColor: "#161622" }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}

            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1 bg-primarybg-servilink px-3">
                        <Stack.Screen options={{ headerShown: false }} />
                        <FlatList
                            data={messages}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingVertical: 12 }}
                            showsVerticalScrollIndicator={false}
                        />
                        <ChatInput
                            onSend={handleSend}
                            onPickImage={() => { }}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SingleEntityScreen>
    );
};

export default ChatScreen;
