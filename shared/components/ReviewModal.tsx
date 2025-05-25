import { usePostStore } from "@/entities/posts";
import { TReview, useReviewStore } from "@/entities/reviews";
import { useUserStore } from "@/entities/users";
import { useContractsByPostId } from "@/features/contracts/useContractById";
import { getAverageReviewRating, getFeaturedReviewByPostId, getTotalReviewsCountByPostId } from "@/features/reviews/service";
import { usePaginatedReviewsByPostId } from "@/features/reviews/usePaginatedFilteredReviews";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, LayoutAnimation, Pressable, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { FloatingActionButton } from "./FloatingActionButton";
import { ReviewCard } from "./ReviewCard";

type ReviewsModalProps = {
  visible: boolean;
  onClose: () => void;
  onPress: () => void;
  postId: string;
  onRef?: (refresh: () => void) => void;
};

export function ReviewsModal({
  visible,
  onClose,
  onPress,
  postId,
  onRef,
}: ReviewsModalProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["60%", "100%"], []);
  const { reviews, loadMore, loading, hasMore, refresh, isRefreshing } = usePaginatedReviewsByPostId(postId);
  const [showLottie, setShowLottie] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const totalReviews = useReviewStore((state) => state.totalReviews);
  const shouldRefresh = useReviewStore((state) => state.shouldRefreshReviews);
  const resetRefreshFlag = useReviewStore((state) => state.resetRefreshFlag);
  const user = useUserStore((state) => state.user);
  const getProviderByPostId = usePostStore((state) => state.getProviderByPostId);
  const postProviderId = getProviderByPostId(postId);
  const setTotalReviews = useReviewStore((state) => state.setTotalReviews);
  /* const setFeaturedReview = useReviewStore((state) => state.setFeaturedReview); */
  const reviewStore = useRef(useReviewStore.getState()).current;


  const { contracts, loading: contractsLoading } = useContractsByPostId(postId);
  const canReview = contracts.some(
    (c) => c.client.id === user?.id && c.progressStatus === "finished"
  );
  const isPostOwner = user?.id === postProviderId;

  const [localReviews, setLocalReviews] = useState<TReview[]>([]);

  useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

  useEffect(() => {
    if (!visible || !shouldRefresh) return;

    let mounted = true;

    (async () => {
      await refresh();

      const [total, featured] = await Promise.all([
        getTotalReviewsCountByPostId(postId),
        getFeaturedReviewByPostId(postId),
      ]);

      if (!mounted) return;

      requestAnimationFrame(() => {
        reviewStore.setTotalReviews(total);
        reviewStore.setFeaturedReview(featured);
        reviewStore.resetRefreshFlag();
      });
    })();

    return () => {
      mounted = false;
    };
  }, [visible, shouldRefresh]);



  const handleDeleteLocal = async (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLocalReviews((prev) => prev.filter((r) => r.id !== id));

    const featured = useReviewStore.getState().featuredReview;
    if (featured?.id === id) {
      useReviewStore.getState().clearFeaturedReview();
      const nextFeatured = await getFeaturedReviewByPostId(postId);
      useReviewStore.getState().setFeaturedReview(nextFeatured);
    }
    const total = await getTotalReviewsCountByPostId(postId);
    useReviewStore.getState().setTotalReviews(total);
    await getAverageReviewRating(postId);
    useReviewStore.getState().removeReview(id);
  };


  const handleRefresh = async () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setShowLottie(true);
    });

    await refresh();
    setLocalReviews(usePaginatedReviewsByPostId(postId).reviews);
    setTimeout(() => {
      setShowLottie(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, 500);
  };

  useEffect(() => {
    if (onRef) {
      onRef(handleRefresh);
    }
  }, []);

  const handleAnimatedClose = () => {
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close"
      opacity={0.6}
    />
  );

  return (
    <>
      {visible && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onClose={onClose}
          enablePanDownToClose
          backgroundStyle={{ backgroundColor: "#161622" }}
          handleIndicatorStyle={{ backgroundColor: "white" }}
          backdropComponent={renderBackdrop}
          animationConfigs={{
            damping: 15,
            mass: 0.8,
            stiffness: 150,
            overshootClamping: false,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
          }}
        >
          {!isPostOwner && !contractsLoading && canReview && (
            <FloatingActionButton
              onPress={() => router.push({ pathname: "/review/create", params: { postId } })}
            />
          )}
          <BottomSheetFlatList
            data={localReviews}
            keyExtractor={(item) => item.id}
            onEndReached={hasMore ? loadMore : undefined}
            onEndReachedThreshold={0.5}
            refreshing={isRefreshing}
            contentContainerStyle={{
              paddingHorizontal: 18,
              paddingBottom: 20,
              paddingTop: 30,
            }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View className="flex-row justify-between items-center px-2 mb-4 mt-4">
                <View>
                  <Text className="text-white/90 font-bold text-base">
                    {totalReviews} Reseñas
                  </Text>
                  <Text className="text-white text-2xl font-bold">
                    {reviews[0]?.post?.title}
                  </Text>
                </View>
                <View className="flex-row items-center gap-x-3">
                  <Pressable onPress={handleRefresh} 
                  className={"bg-black/20 p-2 rounded-full"}>
                    {(showLottie || isRefreshing) ? (
                      <LottieView
                        source={require("../../assets/animations/refresh.json")}
                        autoPlay
                        loop
                        style={{ width: 20, height: 20 }}
                      />
                    ) : (
                      <Animated.View style={{ opacity: fadeAnim }}>
                        <Ionicons name="refresh" size={20} color="#fff" />
                      </Animated.View>
                    )}
                  </Pressable>
                  <Pressable onPress={handleAnimatedClose} className={"bg-black/20 p-2 rounded-full"}>
                    <Ionicons name="close" size={22} color="#fff" />
                  </Pressable>
                </View>
              </View>
            }
            renderItem={({ item, index }) => (
              <Animatable.View
                animation="zoomIn"
                duration={300}
                delay={index * 100}
                useNativeDriver
              >
                <ReviewCard review={item} onDeleteLocal={handleDeleteLocal} />
              </Animatable.View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            ListFooterComponent={
              loading && reviews.length > 0 ? (
                <View className="w-full py-6 items-center">
                  <LottieView
                    source={require("../../assets/animations/loading.json")}
                    autoPlay
                    loop
                    style={{ width: 100, height: 100 }}
                  />
                </View>
              ) : null
            }
            ListEmptyComponent={
              loading ? (
                <View className="w-full mt-20 items-center justify-center">
                  <LottieView
                    source={require("../../assets/animations/loading.json")}
                    autoPlay
                    loop
                    style={{ width: 100, height: 100 }}
                  />
                  <Text className="text-white/60 mt-4 text-base">
                    Cargando reseñas...
                  </Text>
                </View>
              ) : (
                <Text className="text-white/60 mt-4">
                  No hay reseñas para mostrar
                </Text>
              )
            }
          />
        </BottomSheet>
      )}
    </>
  );
}
