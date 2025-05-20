import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { UserContact } from "./UserContact";

const provider = {
    name: "Juan Perez",
    email: "test",
    date: "2023-10-01",
}

export type ReviewCardProps = {
};

export function ReviewCard({}: ReviewCardProps) {
    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i < 4 ? "star" : "star-outline"}
                    size={16}
                    color="#FB9400"
                />
            );
        }
        return stars;
    };
    return(
        <View className="gap-y-2">
            <View className="">
                <UserContact provider={provider}/>
            </View>

            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row justify-between items-center p-0.5">
                    <View className="flex-row">{renderStars()}</View>
                </View>
                <View>
                    <Text className="text-white">-</Text>
                </View>
                <View>
                    <Text className="text-white/60 text-xs">Hace 2 días</Text>
                </View>
                <View>
                    <Text className="text-white">-</Text>
                </View>
                <View>
                    <Text className="text-white/60 text-xs">Juan Rodriguez</Text>
                </View>
                <View>
                    <Text className="text-white">-</Text>
                </View>
                <View>
                    <Text className="text-white/60 text-xs">Plomería</Text>
                </View>
            </View>
                <View>
                    <Text className="text-white text-base">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum, consequatur quam similique cum pariatur nulla
                    </Text>
                </View>
        </View>
    );
}