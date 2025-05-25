import { Screen } from "@/components/Screen";
import { TConversationEntity } from "@/entities/conversations";
import { useInbox } from "@/features/inbox/useInbox";
import { useNavigation } from "@react-navigation/native";
import { FlatList, Image, Pressable, Text, View } from "react-native";


const InboxScreen = () => {
    const { conversations } = useInbox();
    const navigation = useNavigation();

    const renderItem = ({ item }: { item: TConversationEntity }) => {

        return (
            <Pressable
                onPress={() => { }}
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



        );
    };

    return (
        <Screen>
            <Text className="text-2xl text-white font-bold px-4 pt-4 pb-2">Conversaciones</Text>
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View className="border-b border-gray-300/10" />}
            />
        </Screen>
    );
};

export default InboxScreen;
