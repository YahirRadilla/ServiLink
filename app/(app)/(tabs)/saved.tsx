import { Screen } from "@/components/Screen";
import { PostItemCard } from "@/shared/components/PostItemCard";
import { ScrollView, StyleSheet, Text, View } from "react-native";

// @ts-ignore
import Logo from "../../../shared/svg/logo.svg";

export default function Saved() {
  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 24,
          paddingHorizontal: 12,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white/90 font-bold ml-2 text-base">
              28 Posts guardados
            </Text>
            <Text className="text-white text-2xl font-bold ml-2">
              Guardados
            </Text>
          </View>
          <Logo />
        </View>

        <PostItemCard
                  onPress={() => console.log("HOPLA")}
                  image={"https://picsum.photos/400/300"}
                  title="Mesa"
                  neighborhood="Los Olivos"
                  provider="Juan Rodriguez - Plomería"
                  date="2025/01/01"
                  rate={4}
                />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
