import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur"; // 👈 Importa BlurView
import React from "react";
import {
    FlatList,
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type FilterDropdownProps = {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
};

export function FilterDropdown({
  label,
  options,
  selected,
  onSelect,
}: FilterDropdownProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <View className="relative mr-3">
      <Pressable
        onPress={() => setOpen(true)}
        className="border border-links-servilink px-4 py-2 rounded-lg flex-row items-center gap-x-2"
      >
        <Text className="text-white">{selected || label}</Text>
        <Ionicons name="chevron-down" size={16} color="#ccc" />
      </Pressable>

      <Modal transparent visible={open} animationType="fade">
        <Pressable
          onPress={() => setOpen(false)}
          className="flex-1 justify-end"
        >
          {/* Fondo con efecto blur */}
          <BlurView
            intensity={60}
            tint="dark"
            className="absolute top-0 bottom-0 left-0 right-0"
          />

          <Pressable
            onPress={() => {}}
            className="bg-[#12121a] rounded-t-3xl px-6 py-6 max-h-[60%]"
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white font-bold text-lg">{label}</Text>
              <Pressable onPress={() => setOpen(false)}>
                <Ionicons name="close" size={22} color="#fff" />
              </Pressable>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item}
              ItemSeparatorComponent={() => <View className="h-2" />}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                  className={`py-3 px-4 rounded-lg ${
                    selected === item
                      ? "bg-links-servilink/20"
                      : "bg-neutral900"
                  }`}
                >
                  <Text
                    className={`text-white text-base ${
                      selected === item ? "font-bold text-links-servilink" : ""
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
