import { Screen } from "@/components/Screen";
import { FilterPanelModal } from "@/shared/components/FilterPanelModal";
import { PostItemCard } from "@/shared/components/PostItemCard";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
// @ts-ignore
import Logo from "../../../shared/svg/logo.svg";

const filtersData = [
  {
    label: "Colonia",
    key: "colonia",
    options: [
      "Centro",
      "El Esterito",
      "La Posada",
      "Loma Linda",
      "El Zacatal",
      "Los Olivos",
      "Colina del Sol",
      "Fidepaz",
      "Bellavista",
      "La Rinconada",
      "Puesta del Sol",
      "Misiones",
      "San Fernando",
      "Arcoiris",
      "Perlas del Golfo",
      "Indeco",
      "8 de Octubre",
      "El Pedregal",
    ],
  },
  {
    label: "Servicio",
    key: "servicio",
    options: [
      "Electricista",
      "Plomero",
      "Jardinería",
      "Carpintero",
      "Cerrajero",
      "Pintor",
      "Albañil",
      "Técnico en refrigeración",
      "Fumigador",
      "Fontanero",
      "Mecánico a domicilio",
      "Instalación de cámaras",
      "Lavado de tinacos",
      "Reparación de electrodomésticos",
    ],
  },
  {
    label: "Ordenar por",
    key: "ordenar",
    options: ["Recientes", "Más Antigüos"],
  },
];

export default function Saved() {
  const [filtersVisible, setFiltersVisible] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState({
    colonia: "",
    servicio: "",
    ordenar: "",
  });
  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 24,
          paddingHorizontal: 12,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-white/90 font-bold ml-2 text-base">
              28 Posts guardados
            </Text>
            <Text className="text-white text-2xl font-bold ml-2">
              Guardados
            </Text>
          </View>
          <Logo />
        </View>
        <View className="flex-row py-2 mb-4">
          <Pressable
            onPress={() => setFiltersVisible(true)}
            android_ripple={{ color: "#ffffff10" }}
            className="flex-row items-center border border-links-servilink rounded-lg px-4 py-2"
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <Ionicons name="filter" size={16} color="#ccc" />
            <Text className="ml-2 text-white">Filtros</Text>
          </Pressable>

          <FilterPanelModal
            visible={filtersVisible}
            onClose={() => setFiltersVisible(false)}
            filters={filtersData}
            selected={selectedFilters}
            onSelect={(key, value) =>
              setSelectedFilters((prev) => ({ ...prev, [key]: value }))
            }
            onApply={() => {
              setFiltersVisible(false);
            }}
          />
        </View>

        <PostItemCard
          onPress={() => console.log("HOPLA")}
          image={"https://picsum.photos/400/300"}
          title="Mesa"
          neighborhood="Los Olivos"
          provider="Juan Rodriguez - Plomería"
          date="2025/01/01"
          rate={4}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
