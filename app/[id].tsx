import { Screen } from "@/components/Screen";
import { Stack } from "expo-router";
import { Text } from "react-native";


export default function Details() {
    return (
        <Screen>
            <Stack.Screen
                options={{
                    headerTitle: "Hola"
                }} />


            <Text className="text-teal-400">Id</Text>
        </Screen>
    )
}
