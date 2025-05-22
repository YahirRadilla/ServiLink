import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function FloatingActionButton() {
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = () => {
    router.push("/review/create");
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress} style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.85 : 1 },
      ]}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 40,
    bottom: 50,
    zIndex: 999,
  },
  button: {
    backgroundColor: "#3D5DC7",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
