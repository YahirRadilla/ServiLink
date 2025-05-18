import { Screen } from "@/components/Screen";
import { usePaginatedFilteredProposals } from "@/features/proposals/usePaginatedFilteredProposals";
import BackButton from "@/shared/components/BackButton";
import { ItemCard } from "@/shared/components/ItemCard";
import { TopSegmented } from "@/shared/components/TopSegmented";
import { Stack } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { FlatList, Text, View } from "react-native";

export default function WorkSpaceScreen() {
    const [activeTab, setActiveTab] = React.useState('proposals');
    const [filtersVisible, setFiltersVisible] = React.useState(false);
    const handleTabPress = (tab: string) => {
        setActiveTab(tab);
    };

    const [selectedFilters, setSelectedFilters] = React.useState({
        colonia: "",
        servicio: "",
        ordenar: "",
    });

    const { proposals, loadMore, loading, hasMore, refresh, isRefreshing } = usePaginatedFilteredProposals({
        ...selectedFilters
    });

    return (
        <Screen>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="mt-14 p-4">
                <TopSegmented isClient={false} handleTabPress={handleTabPress} activeTab={activeTab} />
            </View>

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
                        image={item.referenceImages![0] || item.post.images[0]}
                        title={item.post.title}
                        status={item.acceptStatus as any}
                        provider={`${item.provider.name} - ${item.post.service}`}
                        date={item.createdAt.toDate().toLocaleDateString()}
                        price={item.priceOffer}
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
                                source={require("@/assets/animations/loading.json")}
                                autoPlay
                                loop
                                style={{ width: 80, height: 80 }}
                            />
                        </View>
                    ) : null
                }
            />


            {/*   {
                activeTab === 'proposals' && (
                    <ProposalsTab />
                )
            }

            {
                activeTab === 'contracts' && (
                    <View className="flex-1 justify-center items-center bg-primarybg-servilink px-4">
                        <Text className="text-white/60 mt-4 text-base">En Contratos</Text>
                    </View>
                )
            }

            {
                activeTab === 'posts' && (
                    <View className="flex-1 justify-center items-center bg-primarybg-servilink px-4">
                        <Text className="text-white/60 mt-4 text-base">En Posts</Text>
                    </View>
                )
            } */}

            <View className="absolute z-10 top-5 left-5 bg-black/50 p-2 rounded-full">
                <BackButton />
            </View>
        </Screen>
    );
}
