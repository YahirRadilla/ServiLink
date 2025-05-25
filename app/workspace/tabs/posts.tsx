import { usePaginatedPostsByProvider } from "@/features/posts/usePaginatedPostsByProvider";
import { FloatingActionButton } from "@/shared/components/FloatingActionButton";
import { PostItemCard } from "@/shared/components/PostItemCard";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { FlatList, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";
export const PostsTab = () => {
    const router = useRouter();
    const [selectedFilters, setSelectedFilters] = React.useState({
        colonia: "",
        ordenar: "",
    });

    const {
        posts,
        refresh,
        isRefreshing,
        loading,
        hasMore,
        loadMore,
    } = usePaginatedPostsByProvider();

    const handleTouchPost = (id: string) => {
        if (!id) return;
        router.push({
            pathname: "/post/[id]",
            params: { id },
        });
    };

    const handlePressFloating = () => {
        router.push("/post/createPost");
    };

    return (

        <View>
            <FloatingActionButton onPress={handlePressFloating} />
            <FlatList
                data={posts}
                onEndReached={hasMore ? loadMore : undefined}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View className="py-6">
                        <Text className="text-white/90 font-bold ml-2 text-base">
                            {posts.length} Publicaciones
                        </Text>
                        <Text className="text-white text-2xl font-bold ml-2">
                            Publicaciones
                        </Text>

                    </View>
                }
                renderItem={({ item, index }) => (


                    <Animatable.View
                        animation="fadeInUp"
                        duration={400}
                        delay={index * 100}
                        useNativeDriver
                    >
                        <PostItemCard
                            postId={item.id}
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
                keyExtractor={(item) => item.id}
                onEndReachedThreshold={0.1}
                refreshing={isRefreshing}
                onRefresh={refresh}
                ListFooterComponent={

                    loading && posts.length > 0 ? (
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
        </View>
    );
};