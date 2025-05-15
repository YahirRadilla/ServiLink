import React, { useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type PostItemCardGalleryProps = {
  onPress: () => void;
  images: string[];
  title: string;
  neighborhood: string;
  provider: string;
  date: string;
  rate: number;
};

export function PostItemCardGallery({
  onPress,
  images,
  title,
  neighborhood,
  provider,
  date,
  rate,
}: PostItemCardGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width - 24;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / screenWidth
    );
    setActiveIndex(index);
  };

  const renderStars = () =>
    Array.from({ length: 5 }, (_, i) => (
      <Text
        key={i}
        className={`text-xs ${i < rate ? "text-yellow-400" : "text-white/20"}`}
      >
        ⭐
      </Text>
    ));

  return (
    <View className="mb-6 rounded-xl border border-links-servilink overflow-hidden">
      {/* Carrusel */}
      <View className="relative w-full h-52">
        <ScrollView
          horizontal
          pagingEnabled
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={{ width: screenWidth }}
        >
          {images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              style={{
                width: screenWidth,
                height: 208,
                backgroundColor: "#00000080",
              }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Indicador de puntos */}
        <View className="absolute bottom-2 w-full flex-row justify-center">
          {images.map((_, i) => (
            <View
              key={i}
              className={`mx-1 w-2 h-2 rounded-full ${i === activeIndex ? "bg-white" : "bg-white/30"}`}
            />
          ))}
        </View>

        {/* Fecha */}
        <View className="absolute top-5 left-5 bg-gray-900 rounded-md px-2 py-1">
          <Text className="text-white font-medium text-xs">{date}</Text>
        </View>
      </View>

      {/* Área presionable */}
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "#ffffff10" }}
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
        className="px-4 py-3"
      >
        <View className="flex-row items-center gap-x-2 p-0.5">
          <View className="w-5 h-5 bg-links-servilink rounded" />
          <Text className="font-semibold text-xl text-white">
            {neighborhood}
          </Text>
        </View>
        <Text className="text-base text-white">{provider}</Text>
        <View className="flex-row justify-between items-center p-0.5">
          <View className="flex-row">{renderStars()}</View>
          <View className="w-5 h-5 bg-white/10 rounded" />
        </View>
      </Pressable>
    </View>
  );
}
