import { Screen } from "@/components/Screen";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
// @ts-ignore
import Logo from "../../../shared/svg/logo.svg";

const filtersData = [
  {
    label: "Ordenar por",
    key: "ordenar",
    options: ["Recientes", "Más Antigüos"],
  },
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
];

export default function Saved() {
  const [filtersVisible, setFiltersVisible] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState({
    colonia: "",
    servicio: "",
    ordenar: "",
  });
  const handleSelect = (key: string, value: string) => {
    if (key === "reset") {
      setSelectedFilters({
        colonia: "",
        servicio: "",
        ordenar: "",
      });
    } else {
      setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    }
  };
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
