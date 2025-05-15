import { Screen } from "@/components/Screen";
import { usePostStore } from "@/entities/posts";
import { useUserStore } from "@/entities/users";
import { usePosts } from "@/features/posts/usePosts";
import { FilterPanelModal } from "@/shared/components/FilterPanelModal";
import { PostItemCard } from "@/shared/components/PostItemCard";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
// @ts-ignore
import Logo from "../../../shared/svg/logo.svg";

export default function Index() {
    const user = useUserStore((state) => state.user);
    const { loading } = usePosts();
    const posts = usePostStore((state) => state.posts);

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
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    paddingVertical: 24,
                    paddingHorizontal: 12,
                }}
                ListHeaderComponent={
                    <>
                        <View className="flex-row items-center justify-between mb-6">
                            <View>
                                <Text className="text-white/90 font-bold ml-2 text-base">
                                    Bienvenido
                                </Text>
                                <Text className="text-white text-2xl font-bold ml-2">
                                    {user?.name}
                                </Text>
                            </View>
                            <Logo />
                        </View>

                        <View className="mb-4 w-full flex-row items-center border border-links-servilink rounded-xl px-4 py-3">
                            <TextInput
                                className="flex-1 text-white"
                                placeholder="Buscar servicio"
                                placeholderTextColor="#ccc"
                            />
                            <Ionicons name="search-outline" size={20} color="#ccc" />
                        </View>

                        <View className="flex-row mb-4">
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
                                onSelect={handleSelect}
                                onApply={() => {
                                    setFiltersVisible(false);
                                }}
                            />
                        </View>
                    </>
                }
                renderItem={({ item }) => (
                    <>
                        <PostItemCard
                            onPress={() => console.log("HOPLA")}
                            image={item.images[0]}
                            title={item.title}
                            neighborhood={item.address.neighborhood}
                            provider={`Juan Rodriguez`}
                            service={item.service}
                            rate={item.valoration}
                        />


                        <PostItemCard
                            onPress={() => console.log("HOPLA")}
                            image={item.images[0]}
                            title={item.title}
                            neighborhood={item.address.neighborhood}
                            provider={`Juan Rodriguez`}
                            service={item.service}
                            rate={item.valoration}
                        />

                        <PostItemCard
                            onPress={() => console.log("HOPLA")}
                            image={item.images[0]}
                            title={item.title}
                            neighborhood={item.address.neighborhood}
                            provider={`Juan Rodriguez`}
                            service={item.service}
                            rate={item.valoration}
                        />

                    </>
                )}
                ListEmptyComponent={
                    <Text className="text-white text-center mt-10">
                        {loading ? "Cargando publicaciones..." : "No hay publicaciones disponibles"}
                    </Text>
                }
            />
        </Screen>
    );
}

const styles = StyleSheet.create({});
