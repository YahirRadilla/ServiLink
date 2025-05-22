
import { usePaginatedFilteredContracts } from "@/features/contracts/usePaginatedFilteredContracts";
import { ItemCard } from "@/shared/components/ItemCard";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { FlatList, Text, View } from "react-native";

export const ContractsTab = () => {
    const router = useRouter();
    const [selectedFilters, setSelectedFilters] = React.useState({
        colonia: "",
        ordenar: "",
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
            pathname: "/proposal/[id]",
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
                </View>
            }
            renderItem={({ item }) => (
                <ItemCard
                    onPress={() => { console.log("click"); }}
                    image={item.referenceImages?.[0] || item.post.images[0]}
                    title={item.post.title}
                    status={item.progressStatus as any}
                    provider={`${item.client.name} - ${item.post.service}`}
                    date={item.createdAt.toDate().toLocaleDateString()}
                    price={item.offers[item.offers.length - 1].price}
                    type="contract"
                />
            )}
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
        />
    );
};