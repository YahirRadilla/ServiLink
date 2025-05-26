import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

interface Props {
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
}

export default function FloatingSwitchButton({
    label,
    icon = "swap-horizontal",
    onPress,
}: Props) {
    const scale = useSharedValue(0.7);
    const opacity = useSharedValue(0);

    useFocusEffect(
        useCallback(() => {
            scale.value = 0;
            opacity.value = 0;
            scale.value = withTiming(1, {
                duration: 500,
                easing: Easing.out(Easing.exp),
            });
            opacity.value = withTiming(1, {
                duration: 500,
                easing: Easing.out(Easing.exp),
            });
        }, [])
    );

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const handlePressIn = () => {
        scale.value = withTiming(0.95, {
            duration: 280,
            easing: Easing.out(Easing.exp),
        });
    };

    const handlePressOut = () => {
        scale.value = withTiming(1, {
            duration: 280,
            easing: Easing.out(Easing.exp),
        });
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            style={{ position: "absolute", bottom: 112, alignSelf: "center", zIndex: 99 }}
        >
            <Animated.View style={[styles.fab, animatedStyle]}>
                <Ionicons name={icon} size={20} color="#fff" />
                <Text style={styles.label}>{label}</Text>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    fab: {
        backgroundColor: "#515DEF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 9999,
        flexDirection: "row",
        alignItems: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    label: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 8,
    },
});
