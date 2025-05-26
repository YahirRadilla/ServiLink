import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
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
    visible?: boolean;
}

export default function FloatingSwitchButton({
    label,
    icon = "swap-horizontal",
    onPress,
    visible = true,
}: Props) {
    const scale = useSharedValue(0.85);
    const opacity = useSharedValue(1);
    const contentOpacity = useSharedValue(1);

    useEffect(() => {
        scale.value = withTiming(1.1, {
            duration: 500,
            easing: Easing.bezier(0.2, 1, 0.3, 1),
        });
        opacity.value = withTiming(1, {
            duration: 500,
            easing: Easing.out(Easing.exp),
        });
    }, []);

    useEffect(() => {
        opacity.value = withTiming(visible ? 1 : 0, {
            duration: 300,
            easing: Easing.out(Easing.exp),
        });
    }, [visible]);

    useEffect(() => {
        contentOpacity.value = 0;
        contentOpacity.value = withTiming(1, {
            duration: 250,
            easing: Easing.out(Easing.exp),
        });
    }, [label, icon]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const contentAnimatedStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
    }));

    const handlePressIn = () => {
        scale.value = withTiming(1.05, {
            duration: 700,
            easing: Easing.out(Easing.exp),
        });
    };

    const handlePressOut = () => {
        scale.value = withTiming(1.1, {
            duration: 700,
            easing: Easing.out(Easing.exp),
        });
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            style={{
                position: "absolute",
                bottom: 112,
                alignSelf: "center",
                zIndex: 99,
                pointerEvents: visible ? "auto" : "none",
            }}
        >
            <Animated.View style={[styles.fab, animatedStyle]}>
                <Animated.View
                    style={[{ flexDirection: "row", alignItems: "center" }, contentAnimatedStyle]}
                >
                    <Ionicons name={icon} size={20} color="#fff" />
                    <Text style={styles.label}>{label}</Text>
                </Animated.View>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    fab: {
        backgroundColor: "#000",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 9999,
        elevation: 7,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    },
    label: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 8,
    },
});
