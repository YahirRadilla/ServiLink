import { usePostStore } from "@/entities/posts";
import { useUserStore } from "@/entities/users";
import { deletePost } from "@/features/posts/services";
import { listenToAverageReviewRating } from "@/features/reviews/service";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ActionPopover } from "./ActionPopover";

type PostItemCardProps = {
  onPress: () => void;
  postId: string;
  image: string;
  title: string;
  neighborhood: string;
  provider: string;
  service: string;
  rate?: number;
  ownerId?: string;
};

export function PostItemCard({
  onPress,
  postId,
  image,
  title,
  neighborhood,
  provider,
  service,
  rate,
  ownerId,
}: PostItemCardProps) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
  }));

  const [averageRating, setAverageRating] = useState(0);
  const user = useUserStore((state) => state.user);
  const showPopover = user?.id === ownerId;
  const [isPressing, setIsPressing] = useState(false);

  const handleSinglePress = () => {
    if (isPressing) return;

    setIsPressing(true);
    try {
      onPress?.();
    } catch (err) {
      console.error(err);
    } finally {

      setTimeout(() => setIsPressing(false), 800);
    }
  };

  useEffect(() => {
    const unsubscribe = listenToAverageReviewRating(postId, (avg) => {
      setAverageRating(avg);
    });

    return () => unsubscribe();
  }, [postId]);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const diff = averageRating - i;
      let iconName: "star" | "star-half" | "star-outline" = "star-outline";
      if (diff >= 1) {
        iconName = "star";
      } else if (diff >= 0.4) {
        iconName = "star-half";
      }

      stars.push(
        <Ionicons
          key={`star-${postId}-${i}`}
          name={iconName}
          size={16}
          color="#FB9400"
        />
      );
    }
    return stars;
  };

  const handlePressIn = () => {
    scale.value = withTiming(0.97, {
      duration: 350,
      easing: Easing.out(Easing.exp),
    });
    shadowOpacity.value = withTiming(0.05, { duration: 120 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 350,
      easing: Easing.out(Easing.exp),
    });
    shadowOpacity.value = withTiming(0.1, { duration: 120 });
  };

  const handleDelete = async () => {
    const success = await deletePost(postId);
    router.replace({ pathname: '/workspace', params: { refetch: 'true' } });
    if (success) {
      usePostStore.getState().disablePostLocally(postId);
    }
  }

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
        },
      ]}
      className="rounded-xl mb-6 overflow-hidden border border-links-servilink"
    >
      {showPopover && (
        <ActionPopover
          onDelete={handleDelete}
          type="post"
          postId={postId}
        />
      )}
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleSinglePress}
        android_ripple={{ color: "#ffffff10" }}
        className="relative"
      >
        {/* Imagen */}
        <View className="relative w-full h-52">
          <Image
            source={{ uri: image }}
            className="w-full h-52 bg-black/50 opacity-40"
            resizeMode="cover"
          />
          <View className="absolute bottom-5 right-5 flex-row gap-x-2">
            <View className="bg-gray-900/80 rounded-md px-2 py-1">
              <Text className="text-white font-medium text-xs">{service}</Text>
            </View>
            <View className="flex-row gap-x-1 bg-gray-900/80 rounded-md pr-2 py-1">
              <Ionicons name="location-sharp" size={16} color="#3D5DC7" />
              <Text className="text-white font-medium text-xs">{neighborhood}</Text>
            </View>
          </View>
        </View>

        {/* Contenido */}
        <View className="px-4 py-3">
          <View className="flex-row items-center gap-x-2 p-0.5">

            <Text className="font-semibold text-lg text-white">
              {title}
            </Text>
          </View>
          <Text className="text-base text-white">{provider}</Text>
          <View className="flex-row justify-between items-center p-0.5">
            <View className="flex-row">{renderStars()}</View>
            {/* <SaveButton /> */}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
