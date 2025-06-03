import { Screen } from "@/components/Screen";
import { SingleEntityScreen } from "@/components/SingleEntityScreen";
import { TConversationEntity } from "@/entities/conversations";
import { useInbox } from "@/features/inbox/useInbox";
import { Stack, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";


const InboxScreen = () => {
    const { conversations } = useInbox();
    const router = useRouter();

    const handleTouchConversation = (item: TConversationEntity) => {
        if (!item.id) return;
        router.push({
            pathname: "/inbox/[id]",
            params: { id: item.id, conversationReceiver: item.userRef.id },
        });
    };

    const [showLoader, setShowLoader] = React.useState(true);

    React.useEffect(() => {
        const timeout = setTimeout(() => setShowLoader(false), 1000);
        return () => clearTimeout(timeout);
    }, []);

    const renderItem = ({ item }: { item: TConversationEntity }) => {

        return (
            <View className="overflow-hidden">
                <Pressable
                    onPress={() => handleTouchConversation(item)}
                    className="flex-row items-center gap-4 px-4 py-3"
                    android_ripple={{
                        color: "#ffffff10",
                        borderless: false,
                    }}
                >
                    <Image
                        source={{
                            uri:
                                item.user.imageProfile ||
                                "https://firebasestorage.googleapis.com/v0/b/servilink-68398.firebasestorage.app/o/user-placeholder.png?alt=media&token=f1ee8fe8-276f-4b86-9ee9-ffce09655e01",
                        }}
                        className="w-12 h-12 rounded-full"
                    />
                    <View>
                        <Text className="font-semibold text-lg text-white">
                            {item.user.name}
                        </Text>
                        <Text className="text-gray-400 max-w-[220px]" numberOfLines={1}>
                            {item.lastMessage}
                        </Text>
                    </View>
                </Pressable>
            </View>


        );
    };

    if (conversations.length === 0 && showLoader) {
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
                        Cargando conversaciones...
                    </Text>
                </View>
            </SingleEntityScreen>
        );
    }

    return (
        <Screen>
            <Text className="text-2xl text-white font-bold px-4 pt-4 pb-2">Conversaciones</Text>
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View className="border-b border-gray-300/10" />}
                ListEmptyComponent={
                    <Text className="text-white text-center mt-10">
                        No hay conversaciones disponibles
                    </Text>
                }
            />
        </Screen>
    );
};

export default InboxScreen;
