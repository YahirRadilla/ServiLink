import { TReview } from "@/entities/reviews";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  LayoutAnimation,
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

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

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
      <View className="flex-row items-center gap-x-2">
        {renderStars()}
        <Text className="text-white">-</Text>
        <Text className="text-white/60 text-xs">
          {dateObj.toLocaleDateString("es-MX", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Text>
        <Text className="text-white">-</Text>
        <Text className="text-white/60 text-xs">{review.client.name} {review.client.lastname}</Text>
        <Text className="text-white">-</Text>
        <Text className="text-white/60 text-xs">{review.postId.service}</Text>
      </View>

      {/* Texto con expansión */}
      <Text
        className="text-white text-base leading-6"
        numberOfLines={expanded ? undefined : 4}
      >
        {review.textContent}
      </Text>

      {review.textContent && review.textContent.length > 150 && (
        <TouchableOpacity onPress={toggleExpanded}>
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
