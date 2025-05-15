import { Screen } from "@/components/Screen";
import { useUserStore } from "@/entities/users";
import { PostItemCard } from "@/shared/components/PostItemCard";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
// @ts-ignore
import Logo from "../../../shared/svg/logo.svg";

export default function Index() {
    const user = useUserStore((state) => state.user);
    console.log(user);

    return (
        <Screen>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingVertical: 24,
                    paddingHorizontal: 12,
                }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-white/90 font-bold ml-2 text-base">
                            Bienvenido
                        </Text>
                        <Text className="text-white text-2xl font-bold ml-2">
                            {user?.name}
                        </Text>
                    </View>
                    <Logo />
                </View>

                <View className="mt-6 mb-4 w-full flex-row items-center border border-links-servilink rounded-xl px-4 py-3">
                    <TextInput
                        className="flex-1 text-white"
                        placeholder="Search for a video topic"
                        placeholderTextColor="#ccc"
                    />
                    <Ionicons name="search-outline" size={20} color="#ccc" />
                </View>

                <PostItemCard
                    onPress={() => console.log("HOPLA")}
                    image={"https://picsum.photos/400/300"}
                    title="Mesa"
                    neighborhood="Los Olivos"
                    provider="Juan Rodriguez - Plomería"
                    date="2025/01/01"
                    rate={4}
                />
                <PostItemCard
                    onPress={() => console.log("HOPLA")}
                    image={"https://picsum.photos/400/300"}
                    title="Mesa"
                    neighborhood="Los Olivos"
                    provider="Juan Rodriguez - Plomería"
                    date="2025/01/01"
                    rate={4}
                /><PostItemCard
                    onPress={() => console.log("HOPLA")}
                    image={"https://picsum.photos/400/300"}
                    title="Mesa"
                    neighborhood="Los Olivos"
                    provider="Juan Rodriguez - Plomería"
                    date="2025/01/01"
                    rate={4}
                /><PostItemCard
                    onPress={() => console.log("HOPLA")}
                    image={"https://picsum.photos/400/300"}
                    title="Mesa"
                    neighborhood="Los Olivos"
                    provider="Juan Rodriguez - Plomería"
                    date="2025/01/01"
                    rate={4}
                />
            </ScrollView>
        </Screen>
    );
}
const styles = StyleSheet.create({});
