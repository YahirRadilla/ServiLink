import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

type FilterOption = {
  label: string;
  key: string;
  options: string[];
};

type FilterPanelProps = {
  visible: boolean;
  onClose: () => void;
  filters: FilterOption[];
  selected: Record<string, string>;
  onApply: (filters: Record<string, string>) => void;
};

export function FilterPanelModal({
  visible,
  onClose,
  filters,
  selected,
  onApply,
}: FilterPanelProps) {
  const [localSelected, setLocalSelected] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) setLocalSelected(selected);
  }, [visible]);

  const handleSelect = (key: string, value: string) => {
    setLocalSelected((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApply(localSelected); // ✅ pasamos todos los filtros seleccionados directamente
  };

  const handleReset = () => {
    const resetFilters: Record<string, string> = {};
    filters.forEach((f) => {
      resetFilters[f.key] = "";
    });
    setLocalSelected(resetFilters);
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 justify-end">
        <Pressable
          onPress={onClose}
          className="absolute top-0 bottom-0 left-0 right-0"
        >
          <BlurView
            intensity={100}
            tint="dark"
            className="flex-1"
            pointerEvents="none"
          />
        </Pressable>

        <View className="bg-primarybg-servilink rounded-t-3xl px-6 py-6 max-h-[70%]">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white font-bold text-lg">Filtros</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={22} color="#fff" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {filters.map((item) => (
              <View key={item.key} className="mb-4">
                <Text className="text-white mb-2 font-semibold">{item.label}</Text>
                <View className="flex-row flex-wrap gap-2">
                  {item.options.map((option) => {
                    const isSelected = localSelected[item.key] === option;
                    return (
                      <Pressable
                        key={option}
                        onPress={() => handleSelect(item.key, option)}
                        className={`px-4 py-2 rounded-full border ${isSelected
                          ? "bg-links-servilink/40 border-links-servilink/40"
                          : "border-white/10"
                          }`}
                      >
                        <Text
                          className={`text-sm ${isSelected
                            ? "font-bold text-links-servilink"
                            : "text-white/50"
                            }`}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>

          <View className="flex-row justify-between gap-x-3">
            <View className="flex-1 rounded-xl overflow-hidden border border-finished-status-servilink">
              <Pressable
                onPress={handleReset}
                android_ripple={{ color: "#ffffff30" }}
                className="w-full py-3 items-center"
              >
                <Text className="text-finished-status-servilink text-center font-bold">
                  Limpiar Filtros
                </Text>
              </Pressable>
            </View>

            <View className="flex-1 rounded-xl overflow-hidden bg-links-servilink">
              <Pressable
                onPress={handleApply}
                android_ripple={{ color: "#ffffff30" }}
                className="w-full items-center flex-1 justify-center"
              >
                <Text className="text-white text-center font-bold">
                  Aplicar filtros
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
