import { Screen } from "@/components/Screen";
import { useProposalStore } from "@/entities/proposals";
import { useProposal } from "@/features/proposals/useProposal";
import { ItemCard } from "@/shared/components/ItemCard";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ContractsScreen() {
  const { loadProposals, loading } = useProposal();

  useEffect(() => {
    loadProposals();
  }, []);

  const proposals = useProposalStore((state) => state.proposals);
  return (
    <Screen>
      <ScrollView>
        <View>
          <View className="py-6">
            <Text className="text-white/90 font-bold ml-2 text-base">
              {proposals.length} Propuestas
            </Text>
            <Text className="text-white text-2xl font-bold ml-2">
              Propuestas
            </Text>
          </View>
        </View>
        <View>
          <ItemCard
            onPress={() => console.log("HOPLA")}
            image=""
            title="Mesa"
            status="accepted"
            provider="Juan Rodriguez - Carpintería"
            date="2025/01/01"
            price={1234}
            type="proposal"
          />
          <ItemCard
            onPress={() => console.log("HOPLA")}
            image=""
            title="Mesa"
            status="rejected"
            provider="Juan Rodriguez - Carpintería"
            date="2025/01/01"
            price={1234}
            type="proposal"
          />
          <ItemCard
            onPress={() => console.log("HOPLA")}
            image=""
            title="Mesa"
            status="pending"
            provider="Juan Rodriguez - Carpintería"
            date="2025/01/01"
            price={1234}
            type="proposal"
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({});
