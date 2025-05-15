import { Image, Pressable, Text, View } from "react-native";

type PostItemCardProps = {
  onPress: () => void;
  image: string;
  title: string;
  neighborhood: string;
  provider: string;
  service: string;
  rate: number;
};

export function PostItemCard({
  onPress,
  image,
  title,
  neighborhood,
  provider,
  service,
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
    <View className="flex-1 rounded-xl mb-6 overflow-hidden border border-links-servilink">
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
          <View className="absolute bottom-5 right-5 flex-row gap-x-2">
            <View className="bg-gray-900/80 rounded-md px-2 py-1">
              <Text className="text-white font-medium text-xs">{service}</Text>
            </View>
            <View className=" bg-gray-900/80 rounded-md px-2 py-1">
              <Text className="text-white font-medium text-xs">{neighborhood}</Text>
            </View>
          </View>  
        </View>

        {/* Contenido */}
        <View className="px-4 py-3">
          <View className="flex-row items-center gap-x-2 p-0.5">
            <View className="w-5 h-5 bg-links-servilink rounded" />
            <Text className="font-semibold text-xl text-white">
              {title}
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
