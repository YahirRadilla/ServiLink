import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  ScrollView
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";
import { ReviewCard } from "./ReviewCard";

type ReviewsModalProps = {
  visible: boolean;
  onClose: () => void;
  onPress: () => void;
};

export function ReviewsModal({ visible, onClose, onPress }: ReviewsModalProps) {
  const translateY = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);
  const TOP_POSITION = 0;
  const MID_POSITION = 300;
  const OFFSCREEN_POSITION = 1000;
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });
  
  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });
  
  const handleCloseWithAnimation = () => {
    translateY.value = withSpring(OFFSCREEN_POSITION, { damping: 18, stiffness: 180});
    backdropOpacity.value = withTiming(0, { duration: 250 }, () => {
      runOnJS(onClose)();
    });
  };
  
  const startY = useSharedValue(0);
  
  const panGesture = Gesture.Pan()
  .onStart(() => {
    startY.value = translateY.value;
  })
  .onUpdate((event) => {
    translateY.value = Math.max(TOP_POSITION, startY.value + event.translationY);
  })
  .onEnd((event) => {
    const y = translateY.value;
    
    if (Math.abs(event.translationY) < 10) return;
    
    if (y > MID_POSITION + 100) {
      translateY.value = withSpring(OFFSCREEN_POSITION, { damping: 18, stiffness: 180 });
      backdropOpacity.value = withTiming(0, { duration: 250 }, () => {
        runOnJS(onClose)();
      });
    } else if (y > MID_POSITION / 2) {
      translateY.value = withSpring(MID_POSITION, { damping: 18, stiffness: 180 });
    } else {
      translateY.value = withSpring(TOP_POSITION, { damping: 18, stiffness: 180 });
    }
  });
  const composedGesture = Gesture.Exclusive(panGesture);
  
  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(MID_POSITION, { damping: 18, stiffness: 180});
      backdropOpacity.value = withSpring(1);
    } else {
      translateY.value = withSpring(OFFSCREEN_POSITION, { damping: 18, stiffness: 180});
      backdropOpacity.value = withSpring(0);
    }
  }, [visible]);

  return (
    <>
      {visible && (
        <Modal transparent animationType="none">
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Pressable
              onPress={handleCloseWithAnimation}
              style={{
                flex: 1,
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            >
              <Animated.View
                style={[{ ...StyleSheet.absoluteFillObject }, backdropStyle]}
              >
                <BlurView intensity={80} tint="dark" style={{ flex: 1 }} />
              </Animated.View>
            </Pressable>
            <GestureDetector  gesture={composedGesture}>
              <Animated.View
                style={[{ flex: 1, backgroundColor: "#161622" }, animatedStyle]}
              >
                <View className="items-center mt-3 mb-4">
                  <View className="w-12 h-1.5 bg-white/40 rounded-full" />
                </View>

                <View className="flex-row justify-between items-center px-6 mb-4">
                  <Text className="text-white">Todas las reseñas</Text>
                  <Pressable onPress={handleCloseWithAnimation}>
                    <Ionicons name="close" size={22} color="#fff" />
                  </Pressable>
                </View>

                <View className="px-6 mb-4">
                  <Text className="text-white/90 font-bold text-base">
                    12 Reseñas
                  </Text>
                  <Text className="text-white text-2xl font-bold">
                    Mesa - Carpintería
                  </Text>
                </View>

                <ScrollView
                  contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingBottom: 350,
                  }}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {[...Array(5)].map((_, i) => (
                    <View
                      key={i}
                      className="border border-links-servilink p-4 mb-4 rounded-xl"
                    >
                      <ReviewCard />
                    </View>
                  ))}
                </ScrollView>
              </Animated.View>
            </GestureDetector >
          </GestureHandlerRootView>
        </Modal>
      )}
    </>
  );
}
