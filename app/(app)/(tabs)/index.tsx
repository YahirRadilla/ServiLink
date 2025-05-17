import { Screen } from "@/components/Screen";
import { filtersData } from "@/data/filters";
import { usePostStore } from "@/entities/posts";
import { useUserStore } from "@/entities/users";
import { usePaginatedFilteredPosts } from "@/features/posts/usePaginatedFilteredPosts";
import { FilterPanelModal } from "@/shared/components/FilterPanelModal";
import { PostItemCard } from "@/shared/components/PostItemCard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import * as Animatable from "react-native-animatable";
// @ts-ignore
import Logo from "../../../shared/svg/logo.svg";

export default function Index() {
    const user = useUserStore((state) => state.user);
    /* const { loading } = usePosts();
    const posts = usePostStore((state) => state.filteredPosts); */
    const setFilters = usePostStore((state) => state.setFilters);
    const applyFilters = usePostStore((state) => state.applyFilters);

    /* console.log("Posts visibles:", posts); */


    const router = useRouter();



    const [searchTerm, setSearchTerm] = React.useState("");
    const [filtersVisible, setFiltersVisible] = React.useState(false);
    const [selectedFilters, setSelectedFilters] = React.useState({
        colonia: "",
        servicio: "",
        ordenar: "",
    });

    const { posts, loadMore, loading, hasMore, refresh, isRefreshing } = usePaginatedFilteredPosts({
        ...selectedFilters,
        searchTerm
    });



    const handleTouchPost = (id: string) => {
        if (!id) return;
        router.push({
            pathname: "/post/[id]",
            params: { id },
        });
    };

    return (
        <Screen>
            <FlatList
                data={posts}
                onEndReached={hasMore ? loadMore : undefined}
                onEndReachedThreshold={0.5}
                keyExtractor={(item) => item.id}
                initialNumToRender={150}
                contentContainerStyle={{
                    paddingVertical: 24,
                    paddingHorizontal: 12,
                    paddingBottom: 120,
                }}
                refreshing={isRefreshing}
                onRefresh={refresh}
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
                                value={searchTerm}
                                onChangeText={(text) => {
                                    setSearchTerm(text);
                                }}
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
                                onApply={(newFilters) => {
                                    setSelectedFilters(newFilters as any);
                                    setFilters(newFilters);
                                    applyFilters(newFilters, searchTerm);
                                    setFiltersVisible(false);
                                }}
                            />
                        </View>
                    </>
                }
                renderItem={({ item, index }) => (

                    <Animatable.View
                        animation="fadeInUp"
                        duration={400}
                        delay={index * 100}
                        useNativeDriver
                    >
                        <PostItemCard
                            onPress={() => handleTouchPost(item.id)}
                            image={item.images[0]}
                            title={item.title}
                            neighborhood={item.address.neighborhood}
                            provider={item.provider.name}
                            service={item.service}
                            rate={item.valoration}
                        />
                    </Animatable.View>


                )}
                ListFooterComponent={
                    loading && posts.length > 0 ? (
                        <View className="w-full py-6 items-center justify-center">
                            <LottieView
                                source={require("../../../assets/animations/loading.json")}
                                autoPlay
                                loop
                                style={{ width: 80, height: 80 }}
                            />
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    loading ? (
                        <View className="w-full mt-20 items-center justify-center">
                            <LottieView
                                source={require("../../../assets/animations/loading.json")}
                                autoPlay
                                loop
                                style={{ width: 100, height: 100 }}
                            />
                            <Text className="text-white/60 mt-4">Cargando publicaciones...</Text>
                        </View>
                    ) : (
                        <Text className="text-white text-center mt-10">
                            No hay publicaciones disponibles
                        </Text>
                    )
                }


            />
        </Screen>
    );
}

const styles = StyleSheet.create({});
