import { ContractsTab } from "@/app/workspace/tabs/contracts";
import { PostsTab } from "@/app/workspace/tabs/posts";
import { ProposalsTab } from "@/app/workspace/tabs/proposals";
import { Screen } from "@/components/Screen";
import { useUserStore } from "@/entities/users";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";




const EmptyTab = ({ label }: { label: string }) => (
    <View className="flex-1 justify-center items-center bg-primarybg-servilink px-4">
        <Text className="text-white/60 mt-4 text-base">En {label}</Text>
    </View>
);

export default function WorkSpaceScreen() {
    const user = useUserStore((state) => state.user);
    const layout = Dimensions.get("window");
    const params = useLocalSearchParams();
    const refetch = params.refetch === "true";
    const tabParam = params.tab as string | undefined;


    const routes = [
        { key: "proposals", title: "Propuestas" },
        { key: "contracts", title: "Contratos" },
        ...(user?.profileStatus !== "client"
            ? [{ key: "posts", title: "Publicaciones" }]
            : []),
    ];

    const initialTabIndex = tabParam
        ? routes.findIndex(r => r.key === tabParam)
        : 0;

    const [index, setIndex] = React.useState(initialTabIndex);

    React.useEffect(() => {
        if (tabParam) {
            const idx = routes.findIndex(r => r.key === tabParam);
            if (idx !== -1) setIndex(idx);
        }
    }, [tabParam, routes.length]);


    const renderScene = ({ route }: { route: { key: string } }) => {
        switch (route.key) {
            case "proposals":
                return <ProposalsTab />;
            case "contracts":
                return <ContractsTab />;
            case "posts":
                return <PostsTab refetch={refetch} />;
            default:
                return null;
        }
    };

    return (
        <Screen>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-row items-center justify-between ">
                <View>
                    <Text className="text-white text-2xl font-bold ml-2">
                        Mi Tablero
                    </Text>
                </View>
            </View>

            <TabView
                swipeEnabled={false}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                style={{ flex: 1, paddingBottom: 66 }}
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
        </Screen>
    );
}
