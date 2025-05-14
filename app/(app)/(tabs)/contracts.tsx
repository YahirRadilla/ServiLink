import { Screen } from "@/components/Screen";
import { useContractStore } from "@/entities/contracts";
import { useContract } from "@/features/contracts/useContract";
import { TestCard } from "@/shared/components/TestCard";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ContractsScreen() {
  const { loadContracts, loading } = useContract();

  useEffect(() => {
    loadContracts();
  }, []);

  const contracts = useContractStore((state) => state.contracts);
  return (
    <Screen>
      <ScrollView>
        <View>
          <View className="py-6">
            <Text className="text-white/90 font-bold ml-2 text-base">
              {contracts.length} Contratos
            </Text>
            <Text className="text-white text-2xl font-bold ml-2">
              Contratos
            </Text>
          </View>
        </View>
        <View>
          <TestCard
            onPress={() => console.log("HOPLA")}
            image=""
            title="Mesa"
            status="pending"
            provider="Juan Rodriguez - Carpintería"
            date="2025/01/01"
            price={1234}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({});
