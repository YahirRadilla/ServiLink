import { Screen } from "@/components/Screen";
import { TPost } from "@/entities/posts";
import { useReviewStore } from "@/entities/reviews";
import { useUserStore } from "@/entities/users";
import { usePosts } from "@/features/posts/usePosts";
import { useReviews } from "@/features/reviews/useReviews";
import BackButton from "@/shared/components/BackButton";
import { CustomButton } from "@/shared/components/CustomButton";
import CustomInput from "@/shared/components/CustomInput";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Pressable, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";



const reviewSchema = Yup.object({
  rating: Yup.number().min(1, "Selecciona al menos una estrella").required(),
  opinion: Yup.string().optional(),
  images: Yup.array().optional(),
});

export default function CreateReviewScreen() {
  const router = useRouter();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { getPost, loading: loadingPost } = usePosts();
  const { createNewReview, loadingReview } = useReviews();
  const [post, setPost] = useState<TPost | null>(null);
  const user = useUserStore((state) => state.user);
  const {
    control,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      opinion: "",
      images: [],
    },
  });

  useEffect(() => {
    getPost(postId as string).then((post) => {
      setPost(post);
    });
  }, [postId]);

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center gap-x-4 p-4">
        <View className="bg-black/50 p-2 rounded-full">
          <BackButton />
        </View>
        <Text className="text-white/90 font-bold ml-2 text-base">
          Califica este servicio
        </Text>
      </View>

      <View className="flex-1 bg-primarybg-servilink">
        {loadingPost || !post ? (
          <View className="w-full mt-20 items-center justify-center">
            <LottieView
              source={require("../../assets/animations/loading.json")}
              autoPlay
              loop
              style={{ width: 100, height: 100 }}
            />
            <Text className="text-white/60 mt-4 text-base">
              Cargando datos del serivcio...
            </Text>
          </View>
        ) : (
          <>
            <Animatable.View animation="fadeInUp" duration={300}>
              <KeyboardAwareScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                enableOnAndroid
                extraScrollHeight={60}
                keyboardShouldPersistTaps="handled"
              >
                <Text className="text-white text-2xl font-bold mt-2 mb-4">
                  Escribe tu evaluación
                </Text>

                <View className="flex-row items-center gap-x-3 mb-1">
                  <Image
                    source={{ uri: user?.imageProfile || "https://firebasestorage.googleapis.com/v0/b/servilink-68398.firebasestorage.app/o/user-placeholder.png?alt=media&token=f1ee8fe8-276f-4b86-9ee9-ffce09655e01" }}
                    className="w-10 h-10 rounded-full"
                  />
                  <Text className="text-white font-semibold text-base">{user?.name} {user?.lastname}</Text>
                </View>
                <Text className="text-white/50 text-sm mb-4">
                  Las opiniones son públicas y contienen información de tu cuenta (el
                  contenido es opcional)
                </Text>

                {/* RATING */}
                <Controller
                  control={control}
                  name="rating"
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <>
                      <View className="flex-row justify-center gap-x-4 items-center my-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Pressable key={index} onPress={() => onChange(index + 1)}>
                            <Ionicons
                              name={index < value ? "star" : "star-outline"}
                              size={36}
                              color="#FB9400"
                              style={{ marginHorizontal: 4 }}
                            />
                          </Pressable>
                        ))}
                      </View>
                      {error?.message && (
                        <Animatable.View
                          animation="fadeIn"
                          duration={200}
                          useNativeDriver>
                          <Text className="text-red-500 text-sm mt-1">
                            {error.message}
                          </Text>
                        </Animatable.View>
                      )}
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name="opinion"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <CustomInput
                      type="text"
                      placeholder="Danos tu opinión"
                      label="Opinión"
                      value={value}
                      onChangeText={onChange}
                      error={error?.message}
                      multiline
                      numberOfLines={4}
                      style={{ textAlignVertical: "top" }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="images"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <CustomInput
                      type="image"
                      label="Imagenes"
                      value={value}
                      onChangeText={onChange}
                      error={error?.message}
                    />
                  )}
                />
              </KeyboardAwareScrollView>
            </Animatable.View>

          </>
        )}

        <View className="absolute bottom-0 left-0 right-0 px-4 pb-6 bg-primarybg-servilink">
          <CustomButton
            label={"Publicar"}
            loading={loadingReview}
            onPress={handleSubmit(async (data) => {
              const id = await createNewReview(data, postId);
              console.log("Reseña creada con ID:", id);
              useReviewStore.getState().triggerRefresh();
              if (postId) {
                router.back();
              }
            })}
/*            onPress={() => {
              console.log("Reseña creada con ID:", postId);
              if (postId) {
                router.back();

              }
           }} */
          />
        </View>
      </View>
    </Screen>
  );
}
