import { Screen } from "@/components/Screen";
import BackButton from "@/shared/components/BackButton";
import { CustomButton } from "@/shared/components/CustomButton";
import CustomInput from "@/shared/components/CustomInput";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";

const reviewSchema = Yup.object({
  rating: Yup.number().min(1, "Selecciona al menos una estrella").required(),
  opinion: Yup.string().optional(),
  images: Yup.array().optional(),
});

export default function CreateReviewScreen() {
  const [rating, setRating] = useState(0);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      opinion: "",
      images: [],
    },
  });

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.6,
      mediaTypes: "images",
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ENCABEZADO */}
      <View className="flex-row items-center gap-x-4 p-4">
        <View className="bg-black/50 p-2 rounded-full">
          <BackButton />
        </View>
        <Text className="text-white/90 font-bold ml-2 text-base">
          Califica este servicio
        </Text>
      </View>

      <View className="flex-1 bg-primarybg-servilink">
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

          {/* USUARIO */}
          <View className="flex-row items-center gap-x-3 mb-1">
            <Image
              source={{ uri: "https://i.pravatar.cc/100" }}
              className="w-10 h-10 rounded-full"
            />
            <Text className="text-white font-semibold text-base">Jaime</Text>
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
                <View className="flex-row items-center mb-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Pressable key={index} onPress={() => onChange(index + 1)}>
                      <Ionicons
                        name={index < value ? "star" : "star-outline"}
                        size={32}
                        color="#FB9400"
                        style={{ marginHorizontal: 4 }}
                      />
                    </Pressable>
                  ))}
                </View>
                {error?.message && (
                  <Text className="text-red-500 text-sm mt-1">
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />

          {/* OPINIÓN */}
          <Controller
            control={control}
            name="opinion"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomInput
                type="text"
                placeholder="Danos tu opinión"
                label="Opinión (opcional)"
                value={value}
                onChangeText={onChange}
                error={error?.message}
                multiline
                numberOfLines={4}
                style={{ textAlignVertical: "top" }}
              />
            )}
          />

          {/* IMAGEN */}
          <Controller
            control={control}
            name="images"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomInput
                type="image"
                label="Imagen principal"
                value={value}
                onChangeText={onChange}
                error={error?.message}
              />
            )}
          />
        </KeyboardAwareScrollView>

        {/* BOTÓN PUBLICAR */}
        <View className="absolute bottom-0 left-0 right-0 px-4 pb-6 bg-primarybg-servilink">
          <CustomButton
            label="Publicar"
            onPress={handleSubmit((data) => {
              console.log("Review enviada:", data);

            })}
          />
        </View>
      </View>
    </Screen>
  );
}
