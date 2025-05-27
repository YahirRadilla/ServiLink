import { TReview } from "@/entities/reviews";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  LayoutAnimation,
  LayoutChangeEvent,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";
import * as Animatable from 'react-native-animatable';

import { useReviewStore } from "@/entities/reviews";
import { useUserStore } from "@/entities/users";
import { deleteReview } from "@/features/reviews/service";
import { ActionPopover } from "./ActionPopover";
import { Gallery } from "./Galery";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ReviewCardProps = {
  review: TReview;
  onDeleteLocal: (id: string) => void;
};

export function ReviewCard({ review, onDeleteLocal }: ReviewCardProps) {
  const [showPopover, setShowPopover] = useState(false);
  const anchorRef = React.createRef<View>();
  const [expanded, setExpanded] = useState(false);
  const [measured, setMeasured] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;
  const user = useUserStore((state) => state.user);
  const [isDeleting, setIsDeleting] = useState(false);
  const cardRef = useRef(null);
  const removeReview = useReviewStore((state) => state.removeReview);
  const triggerRefresh = useReviewStore((s) => s.triggerRefresh);

  const handleDelete = async () => {
    setShowPopover(false);
    setIsDeleting(true);

    const success = await deleteReview(review.id);

    if (success) {
      setIsDeleting(true);
      triggerRefresh();
    }
  };


  const isDeletable = review.client.id === user?.id;

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
    Animated.spring(animation, {
      toValue: expanded ? 0 : 1,
      friction: 10,
      tension: 100,
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
    <Animatable.View
      ref={cardRef}
      animation={isDeleting ? "fadeOutUp" : undefined}
      duration={300}
      onAnimationEnd={() => {
        if (isDeleting) {
          setTimeout(() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            onDeleteLocal(review.id);
          }, 100); // pequeño delay para asegurar que LayoutAnimation se active correctamente
        }
      }}
    >
      <View className="gap-y-2 border border-links-servilink p-4 mb-4 rounded-xl">
        {/* Header */}
        <View className="flex-row items-center justify-between">
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
          {isDeletable && (
            <ActionPopover
              onDelete={handleDelete}
            />
          )}
        </View>

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
          <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.7} className="flex-row-reverse">
            <Text className="text-links-servilink font-semibold mr-1 mt-1">
              {expanded ? "Ver menos" : "Ver más"}
            </Text>
          </TouchableOpacity>
        )}

        {review.images && review.images.length > 0 && (
          <View className="mt-2">
            <Gallery images={review.images.map(img => img.toString())} size={24} />
          </View>
        )}
      </View>
    </Animatable.View>
  );
}
