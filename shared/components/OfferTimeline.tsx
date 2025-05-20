import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const offers = [
    { time: "12:30 p.m", price: "$1,300.00", active: false },
    { time: "12:45 p.m", price: "$1,400.00", active: false },
    { time: "1:00 p.m", price: "$1,300.00", active: true },
];

export default function OfferTimeline() {
    const [showAll, setShowAll] = useState(false);

    const visibleOffers = showAll ? offers : offers.filter((o) => o.active);

    return (
        <View className="p-4">
            <Text className="text-white font-semibold text-lg mb-4">Historial de contraofertas</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
                {visibleOffers.map((item, index) => (
                    <View key={index} className="flex-row items-start mb-4">

                        <View style={{ height: 40 }} className="items-center justify-between mr-3">
                            {index !== 0 && <View className="w-0.5 flex-1 bg-gray-500" />}
                            <View
                                className={`w-3 h-3 rounded-full border ${item.active ? "bg-white border-white" : "bg-gray-400 border-gray-400"
                                    }`}
                            />
                            {index !== visibleOffers.length - 1 && (
                                <View className="w-0.5 flex-1 bg-gray-500" />
                            )}
                        </View>


                        <View className="flex-1 flex-row items-center justify-between border-b border-white/10 pb-2">
                            <Text
                                className={`text-sm ${item.active ? "font-bold text-white" : "text-white/70"
                                    }`}
                            >
                                {item.time}
                            </Text>
                            <Text
                                className={`text-sm ${item.active ? "font-bold text-white" : "text-white/70"
                                    }`}
                            >
                                {item.price}
                            </Text>
                        </View>
                    </View>
                ))}


                <TouchableOpacity
                    onPress={() => setShowAll(!showAll)}
                    className="mt-2 items-center"
                >
                    <Text className="text-links-servilink text-sm underline">
                        {showAll ? "Ocultar historial" : "Ver historial completo"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
