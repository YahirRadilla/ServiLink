import { Screen } from "@/components/Screen";
import { useUserStore } from "@/entities/users";
import BackButton from "@/shared/components/BackButton";
import { Stack } from "expo-router";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { ProposalsTab } from "./tabs/proposals";



const EmptyTab = ({ label }: { label: string }) => (
    <View className="flex-1 justify-center items-center bg-primarybg-servilink px-4">
        <Text className="text-white/60 mt-4 text-base">En {label}</Text>
    </View>
);

export default function WorkSpaceScreen() {
    const user = useUserStore((state) => state.user);
    const layout = Dimensions.get("window");

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "proposals", title: "Propuestas" },
        { key: "contracts", title: "Contratos" },
        { key: "posts", title: "Publicaciones" },
    ]);

    const renderScene = SceneMap({
        proposals: ProposalsTab,
        contracts: () => <EmptyTab label="Contratos" />,
        posts: () => <EmptyTab label="Posts" />,
    });

    return (
        <Screen>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="ml-14 p-4">
                <Text className="text-white font-bold text-xl">Mi tablero</Text>
            </View>

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                style={{ flex: 1 }}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        style={{ backgroundColor: "#161622" }}
                        indicatorStyle={{ backgroundColor: "#3D5DC7", height: 3, borderRadius: 2 }}
                        activeColor="#fff"
                        inactiveColor="#888"
                        pressColor="#3D5DC7"
                    />
                )}

            />

            <View className="absolute z-10 top-5 left-5 bg-black/50 p-2 rounded-full">
                <BackButton />
            </View>
        </Screen>
    );
}
