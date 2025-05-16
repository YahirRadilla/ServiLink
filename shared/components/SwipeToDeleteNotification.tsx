// components/SwipeToDeleteNotification.tsx
import React from "react";
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
    date: string;
    seen: boolean;
  };
  onDelete: (id: string) => void;
};

export function SwipeToDeleteNotification({ item, onDelete }: Props) {
  const translateX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      if (translateX.value < -100) {
        translateX.value = withTiming(-500, { duration: 300 });
        runOnJS(onDelete)(item.id);
      } else {
        translateX.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[animatedStyle, styles.card]}>
        <NotificationCard
          title={item.title}
          content={item.content}
          date={item.date}
          seen={item.seen}
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
});
