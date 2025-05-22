import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

type FloatingActionButtonProps = {
  onPress: () => void;
};

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return(
    <View style={styles.container}>
      <Pressable onPress={onPress} style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.85 : 1 },
      ]}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
};

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
