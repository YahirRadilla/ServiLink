import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

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
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["40%", "90%"], []);
  const [localSelected, setLocalSelected] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
      setLocalSelected(selected);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleSelect = (key: string, value: string) => {
    setLocalSelected((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApply(localSelected);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: Record<string, string> = {};
    filters.forEach((f) => {
      resetFilters[f.key] = "";
    });
    setLocalSelected(resetFilters);
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close"
      opacity={0.6}
    />
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onClose={onClose}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: "#161622" }}
      handleIndicatorStyle={{ backgroundColor: "white" }}
      backdropComponent={renderBackdrop}
    >
      <View className="flex-1 p-6 pt-4">
        {/* HEADER */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white font-bold text-lg">Filtros</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={22} color="#fff" />
          </Pressable>
        </View>

        {/* CONTENIDO */}
        <View>
          <BottomSheetScrollView
            // Quita flex: 1, usa un alto máximo razonable
            style={{ maxHeight: 570 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
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
          </BottomSheetScrollView>
        </View>

        {/* BOTONES FIJOS */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#161622ee",
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: 100,
          }}
        >
          <View className="flex-row gap-x-3">
            {/* Limpiar Filtros */}
            <View className="flex-1 h-12 rounded-xl overflow-hidden border border-finished-status-servilink">
              <Pressable
                onPress={handleReset}
                android_ripple={{ color: "#ffffff30" }}
                className="w-full h-full items-center justify-center"
              >
                <Text className="text-finished-status-servilink text-center font-bold">
                  Limpiar Filtros
                </Text>
              </Pressable>
            </View>

            {/* Aplicar filtros */}
            <View className="flex-1 h-12 rounded-xl overflow-hidden bg-links-servilink">
              <Pressable
                onPress={handleApply}
                android_ripple={{ color: "#ffffff30" }}
                className="w-full h-full items-center justify-center"
              >
                <Text className="text-white text-center font-bold">
                  Aplicar filtros
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}
