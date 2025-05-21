import { TReview } from "@/entities/reviews";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { useEffect, useMemo, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { ReviewCard } from "./ReviewCard";

type ReviewsModalProps = {
  visible: boolean;
  onClose: () => void;
  onPress: () => void;
  reviews: TReview[];
};

export function ReviewsModal({ visible, onClose, onPress, reviews }: ReviewsModalProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["60%", "100%"], []);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

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
            damping: 15,      // Menor = más rebote
            mass: 0.8,        // Menor = más rápido
            stiffness: 150,   // Menor = más suave
            overshootClamping: false, // Permite el rebote
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
          }}
        >
          <BottomSheetFlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: 100,
            }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View className="flex-row justify-between items-center px-2 mb-4 mt-4">
                <View>
                  <Text className="text-white/90 font-bold text-base">
                    {reviews.length} Reseñas
                  </Text>
                  <Text className="text-white text-2xl font-bold">
                    {reviews[0]?.postId?.title}
                  </Text>
                </View>
                <Pressable onPress={onClose}>
                  <Ionicons name="close" size={22} color="#fff" />
                </Pressable>
              </View>
            }
            renderItem={({ item }) => <ReviewCard review={item} />}
          />
        </BottomSheet>
      )}
    </>
  );
}
