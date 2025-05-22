import { Text, View } from "react-native";

type ProposalStatus = "accepted" | "pending" | "rejected";
type ContractStatus = "active" | "pending" | "finished" | "cancelled";
export type StatusType = ProposalStatus | ContractStatus;

type StatusChipProps = {
    status: StatusType;
    type: "proposal" | "contract";
};

const getStatusStyle = (
    status: StatusType,
    type: "proposal" | "contract"
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
        cancelled: [
            "bg-[#3F3F3F]/60",
            "text-[#9F9F9F]",
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
    status: StatusType,
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
        cancelled: "Cancelado",
    };
    return contractTranslations[status as ContractStatus] ?? status;
};

export function StatusChip({ status, type }: StatusChipProps) {
    const [bgColor, textColor] = getStatusStyle(status, type);
    const label = translateStatus(status, type);

    return (
        <View className={`px-3 py-1.5 rounded-xl ${bgColor}`}>
            <Text className={`text-xs font-bold uppercase ${textColor}`}>
                {label}
            </Text>
        </View>
    );
}
