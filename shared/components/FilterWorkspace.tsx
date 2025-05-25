import React from 'react';
import { Pressable, Text, View } from 'react-native';

type StatusType = "accepted" | "pending" | "rejected" | "active" | "finished" | "cancelled";

interface StatusFilterGroupProps {
    type: "proposal" | "contract";
    value: string;
    onChange: (value: StatusType) => void;
}

export function FilterWorkspace({ type, value, onChange }: StatusFilterGroupProps) {
    const options =
        type === "proposal"
            ? [
                { label: "Aceptada", value: "accepted" },
                { label: "Pendiente", value: "pending" },
                { label: "Rechazada", value: "rejected" },
            ]
            : [
                { label: "Activo", value: "active" },
                { label: "Pendiente", value: "pending" },
                { label: "Finalizado", value: "finished" },
                { label: "Cancelado", value: "cancelled" },
            ];

    return (
        <View className="p-2">
            <View className="flex-row flex-wrap gap-2">
                {options.map(({ label, value: val }) => {
                    const isSelected = value === val;
                    return (
                        <View key={val} className="overflow-hidden rounded-full">
                            <Pressable
                                onPress={() => onChange(val as StatusType)}
                                android_ripple={{ color: "#ffffff10" }}
                                className={`px-4 py-2 rounded-full overflow-hidden border transition-all duration-200 ${isSelected
                                    ? "bg-links-servilink/40 border-links-servilink/40"
                                    : "border-white/10"
                                    }`}
                            >
                                <Text
                                    className={`text-sm transition-all duration-200 ${isSelected
                                        ? "font-bold text-links-servilink"
                                        : "text-white/50"
                                        }`}
                                >
                                    {label}
                                </Text>
                            </Pressable>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
