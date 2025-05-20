import { usePaginatedFilteredProposals } from "@/features/proposals/usePaginatedFilteredProposals";
import { ItemCard } from "@/shared/components/ItemCard";
import LottieView from "lottie-react-native";
import React from "react";
import { FlatList, Text, View } from "react-native";

export const ProposalsTab = () => {
    const [selectedFilters, setSelectedFilters] = React.useState({
        colonia: "",
        ordenar: "",
    });

    const {
        proposals,
        loadMore,
        loading,
        hasMore,
        refresh,
        isRefreshing,
    } = usePaginatedFilteredProposals(selectedFilters);

    return (
        <FlatList
            data={proposals}
            onEndReached={hasMore ? loadMore : undefined}
            ListHeaderComponent={
                <View className="py-6">
                    <Text className="text-white/90 font-bold ml-2 text-base">
                        {proposals.length} Propuestas
                    </Text>
                    <Text className="text-white text-2xl font-bold ml-2">
                        Propuestas
                    </Text>
                </View>
            }
            renderItem={({ item }) => (
                <ItemCard
                    onPress={() => console.log("HOPLA")}
                    image={item.referenceImages?.[0] || item.post.images[0]}
                    title={item.post.title}
                    status={item.acceptStatus as any}
                    provider={`${item.client.name} - ${item.post.service}`}
                    date={item.createdAt.toDate().toLocaleDateString()}
                    price={item.priceOffer}
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