import { SingleEntityScreen } from "@/components/SingleEntityScreen";
import { useUserStore } from "@/entities/users";
import { acceptProposalAndCreateContract, rejectProposal } from "@/features/proposals/service";
import { useProposalById } from "@/features/proposals/useProposal";
import BackButton from "@/shared/components/BackButton";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { CustomButton } from "@/shared/components/CustomButton";
import { FormBottomSheetModal } from "@/shared/components/FormBottomSheetModal";
import { Gallery } from "@/shared/components/Galery";
import OfferTimeline from "@/shared/components/OfferTimeline";
import { PostItemCard } from "@/shared/components/PostItemCard";
import { StatusChip, StatusType } from "@/shared/components/StatusChip";
import { UserContact } from "@/shared/components/UserContact";
import { useToastStore } from "@/shared/toastStore";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import MapView, { MapMarker } from "react-native-maps";

export default function ProposalDetails() {
    const { id } = useLocalSearchParams();
    const { proposal, loading } = useProposalById(id as string || null);
    const user = useUserStore((state) => state.user);
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => () => { });
    const mapCustomStyle = [{ "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] }, { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }]

    const toast = useToastStore((s) => s.toastRef);
    const handleTouchPost = (id: string) => {
        if (!id) return;
        router.push({
            pathname: "/post/[id]",
            params: { id },
        });
    };

    const handleReject = async () => {

        if (!proposal) return;

        const success = await rejectProposal(proposal.id);

        if (success) {
            setModalVisible(false);
            toast?.show("Propuesta rechazada", "success", 2000);
            console.log("ropuesta rechazada");
        } else {
            console.log("No se pudo rechazar la propuesta");
        }
    };

    const handleAccept = async () => {

        if (!proposal) return;

        const success = await acceptProposalAndCreateContract(proposal.id, proposal);

        if (success) {
            setModalVisible(false);
            toast?.show("Propuesta aceptada", "success", 2000);
            console.log("ropuesta aceptada");
        } else {
            console.log("No se pudo aceptar la propuesta");
        }
    };

    const handleCounterOffer = (data: any) => {
        console.log("Contraoferta enviada:", data);
        toast?.show("Contraoferta enviada", "success", 2000);
        setFormVisible(false);
    };

    if (loading || !proposal) {
        return (
            <SingleEntityScreen>
                <Stack.Screen options={{ headerShown: false }} />
                <View className="flex-1 justify-center items-center bg-primarybg-servilink px-4">
                    <LottieView
                        source={require("@/assets/animations/loading.json")}
                        autoPlay
                        loop
                        style={{ width: 120, height: 120 }}
                    />
                    <Text className="text-white/60 mt-4 text-base">
                        Cargando Propuesta...
                    </Text>
                </View>
            </SingleEntityScreen>
        );
    }


    return (
        <SingleEntityScreen>
            <Stack.Screen options={{ headerShown: false }} />
            <View className="flex-row items-center justify-between w-full p-4">
                <View className="flex-row items-center">
                    <View className="bg-black/50 p-2 rounded-full mr-2">
                        <BackButton />
                    </View>
                    <Text numberOfLines={2} style={{ maxWidth: "60%" }} ellipsizeMode="tail" className="font-semibold text-lg text-white">{proposal.post.title}</Text>
                </View>

                <StatusChip type="proposal" status={proposal.acceptStatus as StatusType} />

            </View>
            <ScrollView className="p-1 pt-4" showsVerticalScrollIndicator={false}>


                <View className="p-4">
                    <View className="flex-col gap-y-4 mb-24">



                        <View>
                            <Text className="font-semibold text-lg text-white">Descripción</Text>
                            <Text className="text-sm text-white/60">{proposal.description}</Text>
                        </View>
                        <View className="border-b border-gray-300/10" />
                        <View>
                            <Text className="font-semibold text-lg text-white">Detalles</Text>
                            <View className="flex-row gap-x-5 pt-2">
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name="calendar-outline" size={20} color="#ccc" />
                                    <Text className="text-xs text-white/60 pl-2">{proposal.startDate.toDate().toLocaleDateString("es-MX")}</Text>
                                </View>
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name={proposal.paymentMethod as string === "effective" ? "cash-outline" : "card-outline"} size={20} color="#ccc" />
                                    <Text className="text-xs text-white/60 pl-2">{proposal.paymentMethod as string === "effective" ? "Efectivo" : "Tarjeta"}</Text>
                                </View>
                            </View>
                        </View>
                        <View className="border-b border-gray-300/10" />
                        <View>
                            <UserContact provider={proposal.client} />
                        </View>
                        <View className="border-b border-gray-300/10" />

                        <View>
                            <Text className="font-semibold text-lg text-white">Imagenes de referencia</Text>
                            <Gallery images={proposal.referenceImages as string[]} />
                        </View>

                        <View className="border-b border-gray-300/10" />

                        <View>
                            <Text className="font-semibold text-lg text-white">Ubicación</Text>
                            <View className="flex-row items-center gap-x-2">
                                <Ionicons name="location-sharp" size={16} color="#3D5DC7" />
                                <Text className="text-sm text-white/60">
                                    {proposal.address.streetAddress} / {proposal.address.neighborhood}
                                </Text>
                            </View>

                            <View className="mt-4 rounded-xl overflow-hidden h-48 w-full">
                                <MapView
                                    customMapStyle={mapCustomStyle}
                                    style={{ flex: 1 }}
                                    region={{
                                        latitude: proposal.address.latitude as number,
                                        longitude: proposal.address.longitude as number,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    }}
                                >
                                    <MapMarker
                                        coordinate={{
                                            latitude: proposal.address.latitude as number,
                                            longitude: proposal.address.longitude as number,
                                        }}
                                    />
                                </MapView>
                            </View>
                        </View>
                        <View className="border-b border-gray-300/10" />

                        <OfferTimeline offers={proposal.offers} />

                        <View className="border-b border-gray-300/10" />

                        <View className="mb-8 pb-16">
                            <Text className="font-semibold text-lg text-white pb-2">Publicación</Text>
                            <PostItemCard
                                onPress={() => handleTouchPost(proposal.post.id)}
                                image={proposal.post.images[0]}
                                title={proposal.post.title}
                                neighborhood={proposal.post.address.neighborhood}
                                provider={proposal.post.provider.name}
                                service={proposal.post.service}
                                rate={proposal.post.valoration}
                            />
                        </View>

                    </View>
                </View>
            </ScrollView>

            {proposal.acceptStatus === "pending" &&



                <View className="absolute bottom-6 right-4 items-end space-y-3">

                    {(
                        (proposal.offers[proposal.offers.length - 1].isClient && user?.profileStatus === "provider") ||
                        (!proposal.offers[proposal.offers.length - 1].isClient && user?.profileStatus === "client")
                    ) && (
                            <>
                                <CustomButton
                                    className="bg-[#286741] rounded-full w-14 h-14 justify-center items-center shadow-lg mb-3"
                                    onPress={() => {
                                        setConfirmAction(() => handleAccept);
                                        setModalVisible(true);
                                    }}
                                    icon={<Ionicons name="checkmark" size={24} color="#8DFAB9" />}
                                />

                                <CustomButton
                                    className="bg-[#163780] rounded-full w-14 h-14 justify-center items-center shadow-lg"
                                    onPress={() => setFormVisible(true)}
                                    icon={<Ionicons name="swap-horizontal" size={24} color="#54BCF1" />}
                                />

                            </>
                        )}


                    <CustomButton
                        className="bg-[#642E2E] rounded-full w-14 h-14 justify-center items-center shadow-lg"
                        onPress={() => {
                            setConfirmAction(() => handleReject);
                            setModalVisible(true);
                        }}
                        icon={<Ionicons name="close" size={24} color="#E4A2A2" />}
                    />
                    <ConfirmModal
                        isVisible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        onConfirm={() => {
                            confirmAction();
                        }}
                    />
                </View>





            }


            <FormBottomSheetModal
                title="Contraoferta"
                visible={formVisible}
                onClose={() => setFormVisible(false)}
                onSubmit={handleCounterOffer}
            />
        </SingleEntityScreen>
    );
}
