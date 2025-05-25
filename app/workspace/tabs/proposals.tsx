import { usePaginatedFilteredProposals } from "@/features/proposals/usePaginatedFilteredProposals";
import { FilterWorkspace } from "@/shared/components/FilterWorkspace";
import { ItemCard } from "@/shared/components/ItemCard";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { FlatList, Text, View } from "react-native";

export const ProposalsTab = () => {
    const router = useRouter();
    const [selectedFilters, setSelectedFilters] = React.useState({
        colonia: "",
        ordenar: "",
        status: "",
    });

    const {
        proposals,
        loadMore,
        loading,
        hasMore,
        refresh,
        isRefreshing,
    } = usePaginatedFilteredProposals(selectedFilters);

    const handleTouchProposal = (id: string) => {
        if (!id) return;
        router.push({
            pathname: "/proposal/[id]",
            params: { id },
        });
    };


    return (
        <FlatList
            data={proposals}
            onEndReached={hasMore ? loadMore : undefined}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <View className="py-6">
                    <Text className="text-white/90 font-bold ml-2 text-base">
                        {proposals.length} Propuestas
                    </Text>
                    <Text className="text-white text-2xl font-bold ml-2">
                        Propuestas
                    </Text>
                    <View className="flex-col mt-2">
                        <View>
                            <FilterWorkspace
                                type="proposal"
                                value={selectedFilters.status}
                                onChange={(status) =>
                                    setSelectedFilters((prev) => ({ ...prev, status }))
                                }
                            />
                        </View>
                    </View>
                </View>
            }
            renderItem={({ item }) => (
                <ItemCard
                    onPress={() => { handleTouchProposal(item.id) }}
                    image={item.referenceImages?.[0] || item.post.images[0]}
                    title={item.post.title}
                    status={item.acceptStatus as any}
                    provider={`${item.client.name} - ${item.post.service}`}
                    date={item.createdAt.toDate().toLocaleDateString()}
                    price={item.offers[item.offers.length - 1].price}
                    type="proposal"
                />
            )}
            keyExtractor={(item) => item.id}
            onEndReachedThreshold={0.1}
            refreshing={isRefreshing}
            onRefresh={refresh}
            ListFooterComponent={
                loading && proposals.length > 0 ? (
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