import { Ionicons } from "@expo/vector-icons";
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

      <Modal transparent visible={open} animationType="slide">
        <Pressable
          onPress={() => setOpen(false)}
          className="flex-1 bg-black/60 justify-end"
        >
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
