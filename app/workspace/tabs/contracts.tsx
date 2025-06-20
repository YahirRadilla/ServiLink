
import { usePaginatedFilteredContracts } from "@/features/contracts/usePaginatedFilteredContracts";
import { FilterWorkspace } from "@/shared/components/FilterWorkspace";
import { ItemCard } from "@/shared/components/ItemCard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { FlatList, ScrollView, Text, View } from "react-native";

export const ContractsTab = () => {
    const router = useRouter();
    const [selectedFilters, setSelectedFilters] = React.useState({
        colonia: "",
        ordenar: "",
        status: "all",
    });

    const {
        contracts,
        loadMore,
        loading,
        hasMore,
        refresh,
        isRefreshing,
    } = usePaginatedFilteredContracts(selectedFilters);

    const handleTouchProposal = (id: string) => {
        if (!id) return;
        router.push({
            pathname: "/contract/[id]",
            params: { id },
        });
    };

    return (
        <FlatList
            data={contracts}
            onEndReached={hasMore ? loadMore : undefined}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <View className="py-6">
                    <Text className="text-white/90 font-bold ml-2 text-base">
                        {contracts.length} Contratos
                    </Text>
                    <Text className="text-white text-2xl font-bold ml-2">
                        Contratos
                    </Text>
                    <View className="flex-col mt-2">
                        <View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <FilterWorkspace
                                    type="contract"
                                    value={selectedFilters.status}
                                    onChange={(status) =>
                                        setSelectedFilters((prev) => ({ ...prev, status }))
                                    }
                                />
                            </ScrollView>
                        </View>
                    </View>
                </View>
            }
            renderItem={({ item }) => {
                const isPostDeleted = item.post.id === "deleted";
                return (
                    <ItemCard
                        onPress={() => handleTouchProposal(item.id)}
                        image={
                            isPostDeleted
                                ? item.referenceImages?.[0] || "https://placehold.co/600x400?text=Eliminado"
                                : item.post.images[0]
                        }
                        title={isPostDeleted ? item.description : item.post.title}
                        status={item.progressStatus as any}
                        provider={
                            isPostDeleted
                                ? item.client.name
                                : `${item.client.name} - ${item.post.service}`
                        }
                        date={item.createdAt.toDate().toLocaleDateString()}
                        price={item.offers[item.offers.length - 1].price}
                        type="contract"
                    />
                );
            }}
            keyExtractor={(item) => item.id}
            onEndReachedThreshold={0.1}
            refreshing={isRefreshing}
            onRefresh={refresh}
            ListFooterComponent={
                loading && contracts.length > 0 ? (
                    <View className="w-full py-6 items-center justify-center">
                        <LottieView
                            source={require("@/assets/animations/loading.json")}
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
                        <Text className="text-white/60 mt-4">Cargando contratos...</Text>
                    </View>
                ) : (

                    <View className="items-center py-8">
                        <Ionicons name="information-circle-outline" size={60} color="#fff" />
                        <Text className="text-white/80 mt-4 text-xl font-semibold text-center">
                            No hay contratos disponibles
                        </Text>
                        <Text className="text-white/60 mt-2 text-sm text-center">
                            No tienes contratos disponibles pero puedes crear una propuesta nueva
                        </Text>
                    </View>

                )
            }
        />
    );
};