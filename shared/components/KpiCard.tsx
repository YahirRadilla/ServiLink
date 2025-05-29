import { Text, View } from "react-native";

export default function KpiCard({
    title,
    value,
    full = false,
}: {
    title: string;
    value: number | string;
    full?: boolean;
}) {
    return (
        <View
            className={`bg-white rounded-xl shadow px-4 py-3 mb-2 ${full ? "w-full" : "w-[48%]"}`}
        >
            <Text className="text-gray-700 text-sm font-medium mb-1">{title}</Text>
            <Text className="text-indigo-600 text-xl font-bold">{value}</Text>
        </View>
    );
}
