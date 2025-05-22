import { Image, Pressable, Text, View } from "react-native";
import { StatusChip } from "./StatusChip";


type ItemCardProps = {
  onPress: () => void;
  image: string;
  title: string;
  status: "accepted" | "pending" | "rejected" | "active" | "finished" | "cancelled";
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
    <View className="rounded-xl mb-6 overflow-hidden ">
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "#ffffff10" }}
        className="rounded-xl flex-row  gap-x-2 items-center h-28 w-full justify-between"
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
      >
        <View className="flex-row">
          <Image
            source={{ uri: image }}
            className="w-24 h-24 rounded-xl bg-black  mr-2"
            resizeMode="cover"
          />

          <View className="flex-col justify-between max-w-[35vw]">
            <Text
              className="text-white font-semibold text-lg"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            <Text className="text-white/90 text-xs">{provider}</Text>
            <Text className="text-white/90 text-xs">{date}</Text>
          </View>

        </View>

        <View className="h-full flex-col justify-between items-end pr-2 pt-2">
          <StatusChip status={status} type={type} />
          <Text className="text-links-servilink font-bold text-base">
            ${price}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
