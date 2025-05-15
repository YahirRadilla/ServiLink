import { Image, Pressable, Text, View } from "react-native";

type PostItemCardProps = {
  onPress: () => void;
  image: string;
  title: string;
  neighborhood: string;
  provider: string;
  date: string;
  rate: number;
};

export function PostItemCard({
  onPress,
  image,
  title,
  neighborhood,
  provider,
  date,
  rate,
}: PostItemCardProps) {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text
          key={i}
          className={`text-xs ${i < rate ? "text-yellow-400" : "text-white/20"}`}
        >
          ⭐
        </Text>
      );
    }
    return stars;
  };

  return (
    <View className="flex-1 rounded-xl mb-6 max-h-[40%] overflow-hidden border border-links-servilink">
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "#ffffff10" }}
        className="h-80 "
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
      >
        {/* Imagen */}
        <View className="relative w-full h-52">
          <Image
            source={{ uri: image }}
            className="w-full h-52 bg-black/50 opacity-40"
            resizeMode="cover"
          />
          <View className="absolute top-5 left-5 bg-gray-900/80 rounded-md px-2 py-1">
            <Text className="text-white font-medium text-xs">{date}</Text>
          </View>
        </View>

        {/* Contenido */}
        <View className="px-4 py-3">
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
        </View>
      </Pressable>
    </View>
  );
}
