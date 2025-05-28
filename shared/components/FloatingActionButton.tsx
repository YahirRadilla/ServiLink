import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

type FloatingActionButtonProps = {
  onPress: () => void;
};

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
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
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          { opacity: pressed ? 0.85 : 1 },
        ]}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 40,
    bottom: 70,
    zIndex: 999,
  },
  button: {
    backgroundColor: "#3D5DC7",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
