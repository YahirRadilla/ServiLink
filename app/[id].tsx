import { Screen } from "@/components/Screen";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function Details() {
    const { id } = useLocalSearchParams();

    return (
        <Screen>
            <Stack.Screen
                options={{
                    headerTitle: "Hola"
                }} />


            <Text className="text-teal-400">{id}</Text>
        </Screen>
    )
}
