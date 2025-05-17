import { Ionicons } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore";
import React from "react";
import { Text, View } from "react-native";

type NotificationCardProps = {
  onDelete?: () => void;
  title: string;
  content: string;
  createdAt: Timestamp;
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
  createdAt,
  seen,
}: NotificationCardProps) {
  const mailIcon = getMailIcon(seen);
  const dateObj = createdAt.toDate();
  return (
    <View className="flex-row p-4 mb-6 border-links-servilink border rounded-xl">
      <View>
        <View className="flex-row w-full  justify-between items-center mb-1">
          <View className="flex-row items-center gap-x-2">
            <Ionicons name={mailIcon} size={20} color="#ccc" />
            <Text className="text-white font-semibold text-base">{title}</Text>
          </View>
          <Text className="text-white/60 text-sm">
            {dateObj.toLocaleDateString([],{
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <View className="flex-row justify-between items-end">
          <Text className="text-white/70 text-sm flex-1 pr-2" numberOfLines={3}>
            {content}
          </Text>
        </View>
      </View>
    </View>
  );
}
