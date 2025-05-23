import { CustomButton } from '@/shared/components/CustomButton';
import React from 'react';
import { Text, View } from 'react-native';
import Modal from 'react-native-modal';

interface ConfirmModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message?: string;
}

export const ConfirmModal = ({
    isVisible,
    onClose,
    onConfirm,
    message,
}: ConfirmModalProps) => {
    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose} backdropOpacity={0.6}  animationIn={"zoomIn"} animationOut={"zoomOut"} useNativeDriver >
            <View className="bg-primarybg-servilink rounded-xl p-6 border ">
                <Text className="text-white text-lg font-semibold text-center mb-6">
                    {message ?? "¿Estás seguro de efectuar esta acción?"}
                </Text>

                <View className="flex-row justify-between gap-4">
                    <View className="flex-1 ">
                        <CustomButton
                            label="Cancelar"
                            className="border border-gray-200 bg-transparent rounded-xl"
                            onPress={onClose}
                        />
                    </View>
                    <View className="flex-1">
                        <CustomButton
                            label="Aceptar"
                            className=" rounded-xl"
                            onPress={onConfirm}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};
