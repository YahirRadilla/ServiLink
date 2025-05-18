import { Screen } from "@/components/Screen";
import BackButton from "@/shared/components/BackButton";
import { TopSegmented } from "@/shared/components/TopSegmented";
import { Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function WorkSpaceScreen() {
    const [activeTab, setActiveTab] = React.useState('proposals');

    const handleTabPress = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <Screen>
            <Stack.Screen options={{ headerShown: false }} />


            <View className="mt-14 p-4">
                <TopSegmented isClient={false} handleTabPress={handleTabPress} activeTab={activeTab} />
            </View>

            {
                activeTab === 'proposals' && (
                    <View className="flex-1 justify-center items-center bg-primarybg-servilink px-4">
                        <Text className="text-white/60 mt-4 text-base">En Propuestas</Text>
                    </View>
                )
            }

            {
                activeTab === 'contracts' && (
                    <View className="flex-1 justify-center items-center bg-primarybg-servilink px-4">
                        <Text className="text-white/60 mt-4 text-base">En Contratos</Text>
                    </View>
                )
            }

            {
                activeTab === 'posts' && (
                    <View className="flex-1 justify-center items-center bg-primarybg-servilink px-4">
                        <Text className="text-white/60 mt-4 text-base">En Posts</Text>
                    </View>
                )
            }

            <View className="absolute z-10 top-5 left-5 bg-black/50 p-2 rounded-full">
                <BackButton />
            </View>
        </Screen>
    );
}
