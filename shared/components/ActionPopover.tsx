import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Popover, { PopoverPlacement } from "react-native-popover-view";

type ActionPopoverProps = {
    onDelete?: () => void;
    iconColor?: string;
    popoverColor?: string;
    visible?: boolean;
    onClose?: () => void;
    type?: "post" | "review";
    postId?: string;
};

export const ActionPopover = ({
    onDelete,
    iconColor = "#fff",
    popoverColor = "#1f1f2e",
    visible,
    onClose,
    type,
    postId,
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

    const onEdit = () => {
        router.push({ pathname: "/post/editPost", params: { id: postId } });
        handleClose();
    }

    return (
        <View style={{ position: "absolute", top: 10, right: 10, zIndex: 999, overflow: "hidden", borderRadius: 999 }}>
            <Pressable
                ref={anchorRef}
                onPress={handlePress}
                android_ripple={{ color: "#ffffff10" }}
                className={"bg-black/20 rounded-full p-2"}
                style={({ pressed }) => [{ opacity: pressed ? 0.2 : 0.3 }]}
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
                {type === "post" && (
                    <Pressable
                        onPress={() => {
                            handleClose();
                            onEdit();
                        }}
                        className="px-4 py-2"
                        style={({ pressed }) => ({
                            backgroundColor: pressed ? "#2a2a3a" : "transparent",
                            borderRadius: 8,
                        })}
                    >
                        <View className="flex-row items-center gap-x-2">
                            <Ionicons name="create-outline" size={20} color="#FFF" />
                            <Text className="text-white font-medium text-base">
                                Editar
                            </Text>
                        </View>
                    </Pressable>

                )}

                {onDelete && (
                    <Pressable
                        onPress={() => {
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
