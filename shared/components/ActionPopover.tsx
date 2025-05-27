import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Popover, { PopoverPlacement } from "react-native-popover-view";

type ActionPopoverProps = {
    onDelete?: () => void;
    iconColor?: string;
    popoverColor?: string;
    visible?: boolean;
    onClose?: () => void;
};

export const ActionPopover = ({
    onDelete,
    iconColor = "#fff",
    popoverColor = "#1f1f2e",
    visible,
    onClose,
}: ActionPopoverProps) => {
    const [showPopover, setShowPopover] = useState(false);
    const anchorRef = React.createRef<View>();

    const handlePress = () => {
        setShowPopover(true);
    };

    const handleClose = () => {
        setShowPopover(false);
        onClose?.();
    };

    return (
        <View style={{ position: "absolute", top: 10, right: 10, zIndex: 999 }}>
            <Pressable
                ref={anchorRef}
                onPress={handlePress}
                className={"bg-black/20 rounded-full p-2"}
            >
                <Ionicons name="ellipsis-vertical" size={20} color={iconColor} />
            </Pressable>

            <Popover
                isVisible={visible ?? showPopover}
                onRequestClose={handleClose}
                from={anchorRef as React.RefObject<any>}
                placement={PopoverPlacement.LEFT}
                backgroundStyle={{ backgroundColor: "transparent" }}
                popoverStyle={{
                    backgroundColor: popoverColor,
                    paddingVertical: 8,
                    borderRadius: 8,
                }}
            >
                {onDelete && (
                    <Pressable
                        onPress={() => {
                            handleClose();
                            onDelete();
                        }}
                        className="px-4 py-2"
                        style={({ pressed }) => ({
                            backgroundColor: pressed ? "#2a2a3a" : "transparent",
                            borderRadius: 8,
                        })}
                    >
                        <View className="flex-row items-center gap-x-2">
                            <Ionicons name="trash-outline" size={20} color="#F75555" />
                            <Text className="text-[#F75555] font-medium text-base">
                                Eliminar
                            </Text>
                        </View>
                    </Pressable>
                )}
            </Popover>
        </View>
    );
};
