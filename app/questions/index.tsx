import { Screen } from "@/components/Screen";
import { useQuestionStore } from "@/entities/questions/store";
import { useQuestions } from "@/features/questions/useQuestions";
import BackButton from "@/shared/components/BackButton";
import { QuestionItem } from "@/shared/components/QuestionItems";
import { Stack, useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function FAQScreen() {
  const [resetKey, setResetKey] = useState(0);
  const { loading } = useQuestions();
  const questions = useQuestionStore((state) => state.questions);

  useFocusEffect(
    React.useCallback(() => {
      setResetKey((prev) => prev + 1);
    }, [])
  );
  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <FlatList
        data={questions}
        keyExtractor={(item, index) => item.id ?? `faq-${index}`}
        contentContainerStyle={{
          paddingVertical: 24,
          paddingHorizontal: 20,
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <View className="rounded-2xl mb-6">
            <View className="flex-row items-center mb-2 mt-10">
              <View>
                <Text className="text-white text-2xl font-bold">
                  Soluciona tus dudas
                </Text>
                <Text className="text-white/70 text-sm">
                  En esta sección encontrarás respuestas rápidas a las dudas más
                  comunes sobre el uso de la app y la contratación de servicios.
                </Text>
              </View>
            </View>
            <View className="border-t border-white/10 my-4" />
          </View>
        }
        renderItem={({ item }) => (
          <QuestionItem
            key={`${item.id}-${resetKey}`}
            title={item.title}
            answer={item.answer}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <Text className="text-white text-center mt-10">
              Cargando preguntas...
            </Text>
          ) : (
            <Text className="text-white text-center mt-10">
              No hay preguntas disponibles
            </Text>
          )
        }
      />
      <View className="absolute z-10 top-5 left-5 bg-black/50 p-2 rounded-full">
        <BackButton />
      </View>
    </Screen>
  );
}
