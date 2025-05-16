import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import SaveButton from "./SavedButton";

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
        className=""
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
            <SaveButton />
          </View>
        </View>
      </Pressable>
    </View>
  );
}
