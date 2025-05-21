import { TProposal } from "@/entities/proposals";
import { Timestamp } from "firebase/firestore";
import { useRef, useState } from "react";
import { LayoutChangeEvent, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    runOnUI,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

type Props = {
    offers: TProposal["offers"];
};

export default function OfferTimeline({ offers }: Props) {
    const [expanded, setExpanded] = useState(false);
    const measured = useRef(false);

    const contentHeight = useSharedValue(0);
    const animatedHeight = useSharedValue(0);
    const opacity = useSharedValue(0);

    const sortedOffers = [...offers].sort((a, b) => {
        return b.time.toDate().getTime() - a.time.toDate().getTime(); // orden descendente
    });

    const activeOffer = sortedOffers.find((o) => o.active);
    const inactiveOffers = sortedOffers.filter((o) => !o.active);

    const toggle = () => {
        setExpanded((prev) => {
            const next = !prev;
            runOnUI(() => {
                animatedHeight.value = withTiming(next ? contentHeight.value : 0, { duration: 300 });
                opacity.value = withTiming(next ? 1 : 0, { duration: next ? 300 : 200 });
            })();
            return next;
        });
    };

    const handleLayout = (e: LayoutChangeEvent) => {
        if (measured.current) return;
        contentHeight.value = e.nativeEvent.layout.height;
        measured.current = true;
    };

    const animatedStyle = useAnimatedStyle(() => ({
        height: animatedHeight.value,
        opacity: opacity.value,
        overflow: "hidden",
    }));

    return (
        <View className="p-4">
            <Text className="text-white font-semibold text-lg mb-4">Historial de contraofertas</Text>

            {activeOffer && (
                <OfferItem
                    item={activeOffer}
                    index={0}
                    isLast={!expanded && inactiveOffers.length === 0}
                />
            )}

            {inactiveOffers.length > 0 && (
                <TouchableOpacity onPress={toggle} className="items-center mt-2 mb-2">
                    <Text className="text-links-servilink text-sm underline">
                        {expanded ? "Ocultar historial" : "Ver historial completo"}
                    </Text>
                </TouchableOpacity>
            )}

            <View className="absolute opacity-0 -z-10" onLayout={handleLayout} pointerEvents="none">
                {inactiveOffers.map((item, index) => (
                    <OfferItem item={item} index={index} key={`measure-${index}`} isLast={index === inactiveOffers.length - 1} />
                ))}
            </View>

            <Animated.View style={animatedStyle}>
                {inactiveOffers.map((item, index) => (
                    <OfferItem item={item} index={index} key={index} isLast={index === inactiveOffers.length - 1} />
                ))}
            </Animated.View>
        </View>
    );
}

type OfferItemProps = {
    item: { time: Timestamp; price: number; active: boolean };
    index: number;
    isLast: boolean;
};

function OfferItem({ item, index, isLast }: OfferItemProps) {
    const date = item.time.toDate();
    const timeString = date.toLocaleTimeString("es-MX", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    return (
        <View className="flex-row items-start mb-4">
            <View style={{ height: 40 }} className="items-center justify-between mr-3">
                {index !== 0 && <View className="w-0.5 flex-1 bg-gray-500" />}
                <View
                    className={`w-3 h-3 rounded-full border ${item.active ? "bg-white border-white" : "bg-gray-400 border-gray-400"
                        }`}
                />
                {!isLast && <View className="w-0.5 flex-1 bg-gray-500" />}
            </View>

            <View className="flex-1 flex-row items-center justify-between border-b border-white/10 pb-2">
                <Text className={`text-sm ${item.active ? "font-bold text-white" : "text-white/70"}`}>
                    {timeString}
                </Text>
                <Text className={`text-sm ${item.active ? "font-bold text-white" : "text-white/70"}`}>
                    ${item.price} MXN
                </Text>
            </View>
        </View>
    );
}
