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
        <Modal isVisible={isVisible} onBackdropPress={onClose} backdropOpacity={0.6}>
            <View className="bg-primarybg-servilink rounded-xl p-6 border border-links-servilink">
                <Text className="text-white text-lg font-semibold text-center mb-6">
                    {message ?? "¿Estás seguro de que deseas rechazar esta propuesta?"}
                </Text>

                <View className="flex-row justify-between gap-4">
                    <View className="flex-1">
                        <CustomButton
                            label="Cancelar"
                            className="bg-gray-400 rounded-xl"
                            onPress={onClose}
                        />
                    </View>
                    <View className="flex-1">
                        <CustomButton
                            label="Sí, rechazar"
                            className="bg-red-700 rounded-xl"
                            onPress={onConfirm}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};
