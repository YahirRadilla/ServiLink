import { Timestamp } from "firebase/firestore";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { NotificationCard } from "./NotificationCard";

type Props = {
  item: {
    id: string;
    title: string;
    content: string;
    createdAt: Timestamp;
    seen: boolean;
  };
  onDelete: (id: string) => void;
};

export function SwipeToDeleteNotification({ item, onDelete }: Props) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const height = useSharedValue(100);

  useEffect(() => {
    opacity.value = 1;
    scale.value = 1;
    height.value = 100;
  }, [item.id]);

  const gesture = Gesture.Pan()
  .onUpdate((event) => {
    if (event.translationX < 0) {
      const progress = Math.min(1, -event.translationX / 120);
      opacity.value = 1 - progress;
      scale.value = 1 - progress * 0.2;
    }
  })
  .onEnd(() => {
    if (opacity.value < 0.5) {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.8, { duration: 150 });
      height.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(onDelete)(item.id);
      });
    } else {
      opacity.value = withTiming(1);
      scale.value = withTiming(1);
    }
  })
  .activeOffsetX([-10, 10])
  .failOffsetY([-10, 10]);


  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
    height: height.value,
    marginBottom: height.value > 0 ? 12 : 0,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[animatedStyle, styles.card]}
        className="relative rounded-xl overflow-hidden"
      >
        {/* Fondo rojo visible siempre */}
        <Animated.View
          style={{ backgroundColor: "#ef4444", zIndex: 0 }}
          className="absolute inset-0 rounded-xl"
        />

        {/* Tarjeta que se desvanece y colapsa */}
        <NotificationCard
          title={item.title}
          content={item.content}
          createdAt={item.createdAt}
          seen={item.seen}
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
});
