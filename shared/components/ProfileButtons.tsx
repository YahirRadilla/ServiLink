import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type ProfileButtonsProps = {
  onPress?: () => void;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  type?: "primary" | "secondary";
  chevron?: boolean;
};

export function ProfileButtons({
  onPress,
  title,
  icon,
  type = "primary",
  chevron = true,
}: ProfileButtonsProps) {
  const textColor = type === "primary" ? "text-white" : "text-red-400";
  const iconColor = type === "primary" ? "#ccc" : "#f87171";
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "#ffffff10" }}
      className="flex-row items-center justify-between p-4"
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
    >
      <View className="flex-row items-center gap-x-4">
        <Ionicons name={icon} size={20} color={iconColor} />
        <Text className={`text-lg font-semibold ${textColor}`}>{title}</Text>
      </View>
      {chevron && (
        <Ionicons name="chevron-forward" size={20} color={iconColor} />
      )}
    </Pressable>
  );
}
