import { TReview } from "@/entities/reviews";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  LayoutChangeEvent,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { Gallery } from "./Galery";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ReviewCardProps = {
  review: TReview;
};

export function ReviewCard({ review }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [measured, setMeasured] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;

  const dateObj = review.createdAt?.toDate?.() ?? new Date();

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Ionicons
        key={i}
        name={i < review.valoration ? "star" : "star-outline"}
        size={16}
        color="#FB9400"
      />
    ));
  };

  // Medir altura colapsada
  const onCollapsedLayout = (e: LayoutChangeEvent) => {
    if (!collapsedHeight) setCollapsedHeight(e.nativeEvent.layout.height);
  };

  // Medir altura expandida
  const onExpandedLayout = (e: LayoutChangeEvent) => {
    if (!expandedHeight) setExpandedHeight(e.nativeEvent.layout.height);
  };

  // Animar expansión/colapso
  const toggleExpanded = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setExpanded((prev) => !prev);
  };

  // Altura animada
  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [collapsedHeight || 0, expandedHeight || 0],
  });

  // Medición inicial invisible
  if (!measured && review.textContent && review.textContent.length > 150) {
    return (
      <View style={{ opacity: 0, position: "absolute" }}>
        <Text
          className="text-white text-base leading-6"
          numberOfLines={4}
          onLayout={onCollapsedLayout}
        >
          {review.textContent}
        </Text>
        <Text
          className="text-white text-base leading-6"
          onLayout={e => {
            onExpandedLayout(e);
            setMeasured(true);
          }}
        >
          {review.textContent}
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-y-2 border border-links-servilink p-4 mb-4 rounded-xl">
      {/* Header */}
      <View className="flex-row items-center">
        <Image
          source={{
            uri: review.client.imageProfile ||
              "https://firebasestorage.googleapis.com/v0/b/servilink-68398.firebasestorage.app/o/user-placeholder.png?alt=media&token=f1ee8fe8-276f-4b86-9ee9-ffce09655e01",
          }}
          className="w-10 h-10 rounded-full mr-3"
          resizeMode="cover"
        />
        <Text className="font-semibold text-lg text-white">
          {review.client.name}
        </Text>
      </View>

      {/* Metadata */}
      <View className="flex-row flex-wrap items-center gap-x-2">
        {renderStars()}
        <Text className="text-white/60 text-xs">-</Text>
        <Text className="text-white/60 text-xs">
          {dateObj.toLocaleDateString("es-MX", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Text>
        <Text className="text-white/60 text-xs">-</Text>
        <Text className="text-white/60 text-xs flex-shrink">
          {review.post.provider.name} {review.post.provider.lastname}
        </Text>
        <Text className="text-white/60 text-xs">-</Text>
        <Text className="text-white/60 text-xs">{review.post.service}</Text>
      </View>

      {/* Texto con expansión animada */}
      {review.textContent && review.textContent.length > 150 ? (
        <Animated.View style={{ height, overflow: "hidden" }}>
          <Text className="text-white text-base leading-6">
            {review.textContent}
          </Text>
        </Animated.View>
      ) : (
        <Text className="text-white text-base leading-6">
          {review.textContent}
        </Text>
      )}

      {review.textContent && review.textContent.length > 150 && (
        <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.7}>
          <Text className="text-links-servilink font-semibold mt-1">
            {expanded ? "Ver menos" : "Ver más"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Galería */}
      {review.images && review.images.length > 0 && (
        <View className="mt-2">
          <Gallery images={review.images} size={24} />
        </View>
      )}
    </View>
  );
}
