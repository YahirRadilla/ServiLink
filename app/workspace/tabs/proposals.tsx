import { usePaginatedFilteredProposals } from '@/features/proposals/usePaginatedFilteredProposals';
import { ItemCard } from '@/shared/components/ItemCard';
import LottieView from 'lottie-react-native';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

export default function ProposalsTab() {


    const [selectedFilters, setSelectedFilters] = React.useState({
        colonia: "",
        servicio: "",
        ordenar: "",
    });

    const { proposals, loadMore, loading, hasMore, refresh, isRefreshing } = usePaginatedFilteredProposals({
        ...selectedFilters
    });

    return (
        <View>
            <FlatList
                data={proposals}
                ListHeaderComponent={<View>
                    <View className="py-6">
                        <Text className="text-white/90 font-bold ml-2 text-base">
                            {proposals.length} Propuestas
                        </Text>
                        <Text className="text-white text-2xl font-bold ml-2">
                            Propuestas
                        </Text>
                    </View>
                </View>}
                renderItem={({ item }) => (
                    <ItemCard
                        onPress={() => console.log("HOPLA")}
                        image=""
                        title="Mesa"
                        status="accepted"
                        provider="Juan Rodriguez - Carpintería"
                        date="2025/01/01"
                        price={1234}
                        type="proposal"
                    />
                )}
                keyExtractor={(item) => item.id}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                refreshing={isRefreshing}
                onRefresh={refresh}
                ListFooterComponent={
                    loading && proposals.length > 0 ? (
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
            />
        </View>
    )
}