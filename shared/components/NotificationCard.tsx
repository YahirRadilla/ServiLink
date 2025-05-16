import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type NotificationCardProps = {
  onDelete?: () => void;
  title: string;
  content: string;
  date: string;
  seen: boolean;
  showDelete?: boolean;
};

const getMailIcon = (
  seen: boolean
): "mail-unread-outline" | "mail-open-outline" => {
  return seen ? "mail-open-outline" : "mail-unread-outline";
};

export function NotificationCard({
  onDelete,
  title,
  content,
  date,
  seen,
  showDelete = false,
}: NotificationCardProps) {
  const mailIcon = getMailIcon(seen);
  return (
    <View className="flex-row p-4 mb-6 border-links-servilink border rounded-xl">
      <View>
        <View className="flex-row w-full  justify-between items-center mb-1">
          <View className="flex-row items-center gap-x-2">
            <Ionicons name={mailIcon} size={20} color="#ccc" />
            <Text className="text-white font-semibold text-base">{title}</Text>
          </View>
          <Text className="text-white/60 text-sm">
            {new Date(date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <View className="flex-row justify-between items-end">
          <Text className="text-white/70 text-sm flex-1 pr-2" numberOfLines={3}>{content}</Text>
          {showDelete && onDelete && (
            <Pressable onPress={onDelete}>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
