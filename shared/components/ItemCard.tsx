import { Image, Pressable, Text, View } from "react-native";
import { StatusChip } from "./StatusChip";


type ItemCardProps = {
  onPress: () => void;
  image: string;
  title: string;
  status: "accepted" | "pending" | "rejected" | "active" | "finished";
  provider: string;
  date: string;
  price: number;
  type?: "contract" | "proposal";
};



export function ItemCard({
  onPress,
  image,
  title,
  status,
  provider,
  date,
  price,
  type = "proposal",
}: ItemCardProps) {


  return (
    <View className="rounded-xl mb-6 overflow-hidden">
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "#ffffff10" }}
        className="flex-row gap-x-2 items-center h-28 w-full justify-between"
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
      >
        <View className="flex-row">
          <Image
            source={{ uri: image }}
            className="w-24 h-24 rounded-xl bg-black  mr-2"
            resizeMode="cover"
          />

          <View className="flex-col justify-between">
            <View className="flex-row items-center justify-between gap-x-2">
              <Text className="text-white font-semibold text-lg">{title}</Text>

            </View>
            <View className="flex-col gap-3">
              <Text className="text-white/90 text-sm">{provider}</Text>
              <Text className="text-white/90 text-xs">{date}</Text>
            </View>
          </View>
        </View>

        <View className="h-full flex-col justify-between items-end">
          <StatusChip status={status} type={type} />
          <Text className="text-links-servilink font-bold text-base">
            ${price}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
