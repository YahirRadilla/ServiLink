import { Image, Pressable, Text, View } from "react-native";

type ProposalStatus = "accepted" | "pending" | "rejected";
type ContractStatus = "active" | "pending" | "finished";

type TestCardProps = {
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
    type: 'proposal' | 'contract'
): string => {
    if(type === 'proposal'){
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
    }
    return contractTranslations[status as ContractStatus] ?? status;
};

export function TestCard({
  onPress,
  image,
  title,
  status,
  provider,
  date,
  price,
  type = "proposal",
}: TestCardProps) {
  const [bgColor, textColor] = getStatusStyle(status, type);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
    >
      <View className="flex-row w-full rounded-xl p-3 gap-x-4 items-center h-28 mb-6">
        <View>
          <Image
            source={{ uri: image }}
            className="w-28 h-28 rounded-xl bg-black  "
            resizeMode="cover"
          />
        </View>
        <View className="flex-1 justify-end">
          <View className="flex-row items-center gap-x-2 h-full ">
            <Text className="text-white font-semibold text-2xl">{title}</Text>
            <View className={`px-3 py-1.5 rounded-xl ${bgColor}`}>
              <Text className={`text-xs font-bold uppercase ${textColor}`}>
                {translateStatus(status, type)}
              </Text>
            </View>
          </View>
          <View className="flex-col">
            <Text className="text-white/90 text-sm">{provider}</Text>
            <Text className="text-white/90 text-xs">{date}</Text>
          </View>
        </View>

        <View className="h-full justify-between items-end">
          <Image
            source={{ uri: image }}
            className="align- w-6 h-6 bg-black  "
            resizeMode="cover"
          />
          <Text className="text-links-servilink font-bold text-base">
            ${price}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
