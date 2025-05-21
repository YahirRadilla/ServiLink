import { useRef, useState } from "react";
import { LayoutChangeEvent, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    runOnUI,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const offers = [
    { time: "12:30 p.m", price: "$1,300.00", active: false },
    { time: "12:45 p.m", price: "$1,400.00", active: false },
    { time: "1:00 p.m", price: "$1,300.00", active: true },
];

export default function OfferTimeline() {
    const [expanded, setExpanded] = useState(false);
    const measured = useRef(false);

    const contentHeight = useSharedValue(0);
    const animatedHeight = useSharedValue(0);
    const opacity = useSharedValue(0);

    const sortedOffers = [...offers].sort((a, b) => {
        const getMinutes = (t: string) => {
            const [h, m, part] = t.replace('.', '').split(/[: ]/);
            let hour = parseInt(h);
            if (part?.toLowerCase() === 'pm' && hour < 12) hour += 12;
            if (part?.toLowerCase() === 'am' && hour === 12) hour = 0;
            return hour * 60 + parseInt(m);
        };
        return getMinutes(b.time) - getMinutes(a.time);
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

            {/* ✅ Oferta activa siempre visible */}
            {activeOffer && (
                <OfferItem
                    item={activeOffer}
                    index={0}
                    isLast={!expanded && inactiveOffers.length === 0}
                />
            )}

            {/* 🔘 Botón toggle */}
            {inactiveOffers.length > 0 && (
                <TouchableOpacity onPress={toggle} className="items-center mt-2 mb-2">
                    <Text className="text-links-servilink text-sm underline">
                        {expanded ? "Ocultar historial" : "Ver historial completo"}
                    </Text>
                </TouchableOpacity>
            )}

            {/* 🔍 Oculto para medir altura de animación */}
            <View className="absolute opacity-0 -z-10" onLayout={handleLayout} pointerEvents="none">
                {inactiveOffers.map((item, index) => (
                    <OfferItem item={item} index={index} key={`measure-${index}`} isLast={index === inactiveOffers.length - 1} />
                ))}
            </View>

            {/* 📦 Contenido animado */}
            <Animated.View style={animatedStyle}>
                {inactiveOffers.map((item, index) => (
                    <OfferItem item={item} index={index} key={index} isLast={index === inactiveOffers.length - 1} />
                ))}
            </Animated.View>
        </View>
    );
}

type OfferItemProps = {
    item: { time: string; price: string; active: boolean };
    index: number;
    isLast: boolean;
};

function OfferItem({ item, index, isLast }: OfferItemProps) {
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
                    {item.time}
                </Text>
                <Text className={`text-sm ${item.active ? "font-bold text-white" : "text-white/70"}`}>
                    {item.price}
                </Text>
            </View>
        </View>
    );
}
