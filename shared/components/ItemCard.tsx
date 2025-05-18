import { Image, Pressable, Text, View } from "react-native";

type ProposalStatus = "accepted" | "pending" | "rejected";
type ContractStatus = "active" | "pending" | "finished";

type ItemCardProps = {
  onPress: () => void;
  image: string;
  title: string;
  status: "accepted" | "pending" | "rejected" | "active" | "finished";
  provider: string;
  date: string;
  price: number;
  type?: "contract" | "proposal";
};

const getStatusStyle = (
  status: ProposalStatus | ContractStatus,
  type: "proposal" | "contract" = "proposal"
): [string, string] => {
  const proposalMap: Record<ProposalStatus, [string, string]> = {
    accepted: ["bg-active-status-servilink/40", "text-active-status-servilink"],
    pending: [
      "bg-pending-status-servilink/40",
      "text-pending-status-servilink",
    ],
    rejected: [
      "bg-finished-status-servilink/40",
      "text-finished-status-servilink",
    ],
  };

  const contractMap: Record<ContractStatus, [string, string]> = {
    active: ["bg-active-status-servilink/40", "text-active-status-servilink"],
    pending: [
      "bg-pending-status-servilink/40",
      "text-pending-status-servilink",
    ],
    finished: [
      "bg-finished-status-servilink/40",
      "text-finished-status-servilink",
    ],
  };

  if (type === "proposal" && status in proposalMap) {
    return proposalMap[status as ProposalStatus];
  }

  if (type === "contract" && status in contractMap) {
    return contractMap[status as ContractStatus];
  }

  return ["bg-gray-500", "text-white"];
};

const translateStatus = (
  status: ProposalStatus | ContractStatus,
  type: "proposal" | "contract"
): string => {
  if (type === "proposal") {
    const translations: Record<ProposalStatus, string> = {
      accepted: "Aceptada",
      pending: "Pendiente",
      rejected: "Rechazada",
    };
    return translations[status as ProposalStatus] ?? status;
  }
  const contractTranslations: Record<ContractStatus, string> = {
    active: "Activo",
    pending: "Pendiente",
    finished: "Finalizado",
  };
  return contractTranslations[status as ContractStatus] ?? status;
};

export function ItemCard({
  onPress,
  image,
  title,
  status,
  provider,
  date,
  price,
  type = "proposal",
}: ItemCardProps) {
  const [bgColor, textColor] = getStatusStyle(status, type);

  return (
    <View className="rounded-xl mb-6 overflow-hidden">
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "#ffffff10" }}
        className="flex-row gap-x-2 items-center h-28 w-full justify-between"
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
      >
        <View className="flex-row">
          <Image
            source={{ uri: image }}
            className="w-24 h-24 rounded-xl bg-black  mr-2"
            resizeMode="cover"
          />

          <View className="flex-col justify-between">
            <View className="flex-row items-center justify-between gap-x-2">
              <Text className="text-white font-semibold text-lg">{title}</Text>

            </View>
            <View className="flex-col gap-3">
              <Text className="text-white/90 text-sm">{provider}</Text>
              <Text className="text-white/90 text-xs">{date}</Text>
            </View>
          </View>
        </View>

        <View className="h-full flex-col justify-between items-end">
          <View className={`px-3 py-1.5 rounded-xl ${bgColor}`}>
            <Text className={`text-xs font-bold uppercase ${textColor}`}>
              {translateStatus(status, type)}
            </Text>
          </View>
          <Text className="text-links-servilink font-bold text-base">
            ${price}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
