import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";

type ReviewsModalProps = {
    visible: boolean;
    onClose: () => void;
    onPress: () => void;
};

export function ReviewsModal( {
    visible,
    onClose,
    onPress,
}: ReviewsModalProps) {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View className="flex-1">


                <View className="flex-1 bg-primarybg-servilink p-4 ">
                    <View className="flex-row justify-between items-center mb-4 mx-2">
                        <Text className="text-white">Todas las reseñas</Text>
                        <Pressable onPress={() => {console.log("Cerrar"); onClose()}}>
                            <Ionicons name="close" size={22} color="#fff" />
                        </Pressable>
                    </View>


                    <View className="flex-row items-center justify-between mb-6">
                        <View>
                            <Text className="text-white/90 font-bold ml-2 text-base">
                                12 Reseñas
                            </Text>
                            <Text className="text-white text-2xl font-bold ml-2">
                            Mesa - Carpintería
                            </Text>
                        </View>
                    </View>



                </View>
            </View>
        </Modal>
    );
}