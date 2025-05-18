import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import Animated, {
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  title: string;
  answer: string;
};

export function QuestionItem({ title, answer }: Props) {
  const [expanded, setExpanded] = useState(false);
  const measured = useRef(false);

  const contentHeight = useSharedValue(0);
  const animatedHeight = useSharedValue(0);
  const opacity = useSharedValue(0);

  const toggleExpand = () => {
    setExpanded((prev) => {
      const next = !prev;
      if (next) {
        runOnUI(() => {
          animatedHeight.value = withTiming(contentHeight.value, {
            duration: 300,
          });
          opacity.value = withTiming(1, { duration: 300 });
        })();
      } else {
        runOnUI(() => {
          animatedHeight.value = withTiming(0, { duration: 300 });
          opacity.value = withTiming(0, { duration: 200 });
        })();
      }
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
    <View>
      <Pressable
        onPress={toggleExpand}
        className="flex-row items-center justify-between p-4"
        android_ripple={{ color: "#ffffff10" }}
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
      >
        <Text className="text-base font-semibold text-white flex-1 pr-4">
          {title}
        </Text>
        <Ionicons
          name={expanded ? "remove-outline" : "add-outline"}
          size={20}
          color="#ccc"
        />
      </Pressable>

      {/* Medidor oculto */}
      <View
        className="px-4 pb-2 absolute opacity-0 -z-10"
        onLayout={handleLayout}
        pointerEvents="none"
      >
        <Text className="text-white/70 text-sm">{answer}</Text>
      </View>

      {/* Contenedor animado */}
      <Animated.View style={animatedStyle} className="px-4 pb-2">
        <Text className="text-white/70 text-sm">{answer}</Text>
      </Animated.View>

      <View className="border-t border-white/10 mx-4" />
    </View>
  );
}
