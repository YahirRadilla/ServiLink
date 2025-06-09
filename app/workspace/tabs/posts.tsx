import { usePaginatedPostsByProvider } from "@/features/posts/usePaginatedPostsByProvider";
import { FloatingActionButton } from "@/shared/components/FloatingActionButton";
import { PostItemCard } from "@/shared/components/PostItemCard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { FlatList, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";
export const PostsTab = ({ refetch }: { refetch?: boolean }) => {
    const router = useRouter();

    const {
        posts,
        refresh,
        isRefreshing,
        loading,
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

    React.useEffect(() => {
        if (refetch) {
            refresh();
        }
    }, [refetch]);

    return (

        <View className="flex-1">
            <FlatList
                data={posts}
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
                            ownerId={item.provider.id}
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
                        <View className="items-center py-8">
                            <Ionicons name="information-circle-outline" size={60} color="#fff" />
                            <Text className="text-white/80 mt-4 text-xl font-semibold text-center">
                                No hay publicaciones disponibles
                            </Text>
                            <Text className="text-white/60 mt-2 text-sm text-center">
                                No tienes publicaciones disponibles pero puedes crear una nueva
                            </Text>
                        </View>
                    )
                }
            />
            <FloatingActionButton onPress={handlePressFloating} />
        </View>
    );
};