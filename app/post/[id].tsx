import { SingleEntityScreen } from "@/components/SingleEntityScreen";
import { TPost, usePostStore } from "@/entities/posts";
import { useReviewStore } from "@/entities/reviews";
import { useUserStore } from "@/entities/users";
import { usePosts } from "@/features/posts/usePosts";
import { getAverageReviewRating, getFeaturedReviewByPostId, getTotalReviewsCountByPostId } from "@/features/reviews/service";
import { useLiveReviewsByPostId } from "@/features/reviews/useReviews";
import BackButton from "@/shared/components/BackButton";
import { CustomButton } from "@/shared/components/CustomButton";
import { Gallery } from "@/shared/components/Galery";
import { ReviewCard } from "@/shared/components/ReviewCard";
import { ReviewsModal } from "@/shared/components/ReviewModal";
import SaveButton from "@/shared/components/SavedButton";
import { UserContact } from "@/shared/components/UserContact";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import MapView, { Marker as MapMarker } from "react-native-maps";

export default function Details() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { getPost, loading } = usePosts();
    const [post, setPost] = useState<TPost | null>(null);
    const user = useUserStore((state) => state.user);
    const [averageRating, setAverageRating] = useState<number>(0);
    const { reviews } = useLiveReviewsByPostId(id as string);
    const totalReviews = useReviewStore((state) => state.totalReviews);
    const postStore = usePostStore();
    const mapCustomStyle = [{ "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] }, { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }]
    const [refreshModal, setRefreshModal] = useState<() => void>(() => () => { });
    const shouldRefresh = useReviewStore((state) => state.shouldRefreshReviews);
    const featuredReview = useReviewStore((state) => state.featuredReview);
    const setFeaturedReview = useReviewStore((state) => state.setFeaturedReview);
    const setTotalReviews = useReviewStore((state) => state.setTotalReviews);
    const resetRefreshFlag = useReviewStore((state) => state.resetRefreshFlag);
    const clearFeaturedReview = useReviewStore((state) => state.clearFeaturedReview);
    const removeReview = useReviewStore((state) => state.removeReview);


    const handleHire = () => {
        router.push("/proposal/createProposal");
    };

    const [isModalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        getPost(id as string).then((post) => {
            setPost(post);
            postStore.setCurrentPost(post!);
        });
        getFeaturedReviewByPostId(id as string).then((review) => {
            setFeaturedReview(review);
        })
        getAverageReviewRating(id as string).then(setAverageRating);

        getTotalReviewsCountByPostId(id as string).then(setTotalReviews);
        return () => {
            clearFeaturedReview();
        };
    }, []);
    if (loading || !post) {
        return (
            <SingleEntityScreen>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 justify-center items-center bg-primarybg-servilink px-4">
                    <LottieView
                        source={require("@/assets/animations/loading.json")}
                        autoPlay
                        loop
                        style={{ width: 120, height: 120 }}
                    />
                    <Text className="text-white/60 mt-4 text-base">
                        Cargando publicación...
                    </Text>
                </View>
            </SingleEntityScreen>
        );
    }

    return (
        <SingleEntityScreen>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView>
                <View className="w-full rounded-b-3xl overflow-hidden">
                    <View className="absolute z-10 bottom-5 left-5">
                        <Text className="font-semibold text-lg text-white">{post.title}</Text>
                        <Text className="text-sm text-white/60">{post.service}</Text>
                    </View>

                    <View className="absolute z-10 top-5 right-5 bg-black/50 p-2 rounded-full">
                        <SaveButton />
                    </View>

                    <View className="absolute z-10 top-5 left-5 bg-black/50 p-2 rounded-full">
                        <BackButton />
                    </View>

                    <Image
                        source={{ uri: post.images[0] }}
                        className="w-full h-[320px] bg-black/50 opacity-30"
                        resizeMode="cover"
                        alt={post.title}
                    />
                </View>

                <View className="p-4">
                    <View className="flex-col gap-y-4 mb-24">
                        <View>
                            <Text className="font-semibold text-lg text-white">Descripción</Text>
                            <Text className="text-sm text-white/60">{post.description}</Text>
                        </View>

                        <View className="flex-row items-center justify-start gap-x-1">
                            <View className="self-start px-3 py-1.5 rounded-xl bg-neutral800/80">
                                <Text className="text-xs font-bold uppercase text-primary-servilink">
                                    {post.postType as string === "fix" ? "Fijo" : "Personalizado"}
                                </Text>
                            </View>

                            <View className="flex-row items-center gap-x-2">
                                <Ionicons name="star" size={20} color="#FB9400" />
                                <Text className="text-sm text-white/60">
                                    {averageRating.toFixed(1)} ({totalReviews} Reseñas)
                                </Text>
                            </View>
                        </View>

                        <View>
                            <UserContact provider={post.provider} />
                        </View>
                        <View>
                            <Text className="font-semibold text-lg text-white">Galería</Text>
                            <Gallery images={post.images} />
                        </View>
                        <View>
                            <Text className="font-semibold text-lg text-white">Ubicación</Text>
                            <View className="flex-row items-center gap-x-2 mb-2">
                                <Ionicons name="location-sharp" size={16} color="#3D5DC7" />
                                <Text className="text-sm text-white/60">
                                    {post.address.streetAddress} / {post.address.neighborhood}
                                </Text>
                            </View>

                            <View className="mt-4 rounded-xl overflow-hidden h-48 w-full">
                                <MapView
                                    customMapStyle={mapCustomStyle}
                                    style={{ flex: 1 }}
                                    region={{
                                        latitude: post.address.latitude as number,
                                        longitude: post.address.longitude as number,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    }}
                                >
                                    <MapMarker
                                        coordinate={{
                                            latitude: post.address.latitude as number,
                                            longitude: post.address.longitude as number,
                                        }}
                                    />
                                </MapView>
                            </View>

                        </View>

                        <View className="flex-col ">
                            <Text className="font-semibold text-lg text-white">Reseñas</Text>
                            <View className="flex-row items-center justify-between w-full mb-2">
                                <View className="flex-row items-center gap-x-2">
                                    <Ionicons name="star" size={20} color="#FB9400" />
                                    <Text className="text-sm text-white/60">
                                        {averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                                    </Text>
                                </View>
                                <Pressable
                                    onPress={() => {
                                        setModalVisible(true);
                                        setTimeout(() => {
                                            refreshModal();
                                        }, 0);
                                    }}
                                    android_ripple={{ color: "#ffffff10" }}
                                    style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                                    className="px-4 py-2 rounded-xl bg-links-servilink/20"
                                >
                                    <Text className="text-links-servilink font-semibold text-sm">Ver todas</Text>
                                </Pressable>
                            </View>

                        </View>

                        <View>
                            {featuredReview && (
                                <ReviewCard
                                    review={featuredReview}
                                    onDeleteLocal={async (id) => {
                                        clearFeaturedReview();

                                        const total = await getTotalReviewsCountByPostId(post.id);
                                        setTotalReviews(total);

                                        const avg = await getAverageReviewRating(post.id);
                                        setAverageRating(avg);

                                        const nextFeatured = await getFeaturedReviewByPostId(post.id);
                                        setFeaturedReview(nextFeatured);

                                        refreshModal();
                                    }}
                                />

                            )}
                        </View>

                    </View>
                </View>
            </ScrollView>
            {
                user?.profileStatus === "client" && (
                    <View className="p-4 absolute bottom-0 w-full flex-row items-center justify-between bg-black/80">
                        <View className="flex-row items-center gap-x-2">
                            <Text className="text-lg text-white/60">Precios</Text>
                            <Text className="text-base text-white/90">
                                ${post.minPrice} - {post.maxPrice} MXN
                            </Text>
                        </View>

                        <CustomButton label="Contratar" onPress={() => { handleHire() }} />
                    </View>

                )
            }
            <ReviewsModal
                visible={isModalVisible}
                onPress={() => console.log("modal interno")}
                onClose={() => setModalVisible(false)}
                postId={post.id}
                onRef={(fn) => {
                    console.log("✅ Refresh set");
                }}
            />
        </SingleEntityScreen>
    );
}
