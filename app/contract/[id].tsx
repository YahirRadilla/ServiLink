import { SingleEntityScreen } from "@/components/SingleEntityScreen";
import { useUserStore } from "@/entities/users";
import { manageStatusContract } from "@/features/contracts/service";
import { useContractById } from "@/features/contracts/useContractById";
import { usePaymentSheetSetup } from "@/features/contracts/usePaymentSheetSetup";
import BackButton from "@/shared/components/BackButton";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { CustomButton } from "@/shared/components/CustomButton";
import { Gallery } from "@/shared/components/Galery";
import OfferTimeline from "@/shared/components/OfferTimeline";
import { PostItemCard } from "@/shared/components/PostItemCard";
import { StatusChip, StatusType } from "@/shared/components/StatusChip";
import { UserContact } from "@/shared/components/UserContact";
import { useToastStore } from "@/shared/toastStore";
import { Ionicons } from "@expo/vector-icons";
import { presentPaymentSheet } from "@stripe/stripe-react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import MapView, { MapMarker } from "react-native-maps";

export default function ContractDetails() {
    const { id } = useLocalSearchParams();
    const { contract, loading, error, refetch } = useContractById(id as string);
    const mapCustomStyle = [{ "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] }, { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }]
    const user = useUserStore((state) => state.user);
    const router = useRouter();
    const toast = useToastStore((s) => s.toastRef);
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => () => { });
    const { showPaymentButton, initializePaymentSheet, loadingIsPayment, setShowPaymentButton } = usePaymentSheetSetup({
        contract,
        userId: contract?.client.id,
        profileStatus: contract?.client.profileStatus,
    });
    const handleTouchPost = (id: string) => {
        if (!id) return;
        router.push({
            pathname: "/post/[id]",
            params: { id },
        });
    };


    const handleCancelContract = async () => {
        if (!contract) return;

        const success = await manageStatusContract(contract.id, "cancelled");
        if (success) {
            setModalVisible(false);
            toast?.show("Contrato cancelado", "success", 2000);
            console.log("Contrato cancelado");
        } else {
            console.log("No se pudo cancelar el contrato");
        }
    };

    const handleActiveContract = async () => {
        if (!contract) return;

        const success = await manageStatusContract(contract.id, "active");
        if (success) {
            setModalVisible(false);
            toast?.show("Contrato activado", "success", 2000);
            console.log("Contrato activado");
        } else {
            console.log("No se pudo activar el contrato");
        }
    };

    const handleFinishContract = async () => {
        if (!contract) return;

        const success = await manageStatusContract(contract.id, "finished");
        if (success) {
            setModalVisible(false);
            toast?.show("Contrato finalizado", "success", 2000);
            console.log("Contrato finalizado");
        } else {
            console.log("No se pudo finalizar el contrato");
        }
    };

    useEffect(() => {
        initializePaymentSheet();
    }, [contract]);


    if (loading || loadingIsPayment || !contract) {
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
                        Cargando Contrato...
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
                    <Text numberOfLines={2} style={{ maxWidth: "60%" }} ellipsizeMode="tail" className="font-semibold text-lg text-white">{contract.post.title}</Text>
                </View>

                <StatusChip type="contract" status={contract.progressStatus as StatusType} />

            </View>
            <ScrollView className="p-1 pt-4" showsVerticalScrollIndicator={false}>


                <View className="p-4">
                    <View className="flex-col gap-y-4 mb-24">



                        <View>
                            <Text className="font-semibold text-lg text-white">Descripción</Text>
                            <Text className="text-sm text-white/60">{contract.description}</Text>
                        </View>
                        <View className="border-b border-gray-300/10" />
                        <View>
                            <Text className="font-semibold text-lg text-white">Precio Final</Text>
                            <Text className="text-sm text-white/60">${contract.offers[contract.offers.length - 1].price} MXN</Text>
                        </View>
                        <View className="border-b border-gray-300/10" />
                        <View>
                            <Text className="font-semibold text-lg text-white">Detalles</Text>
                            <View className="flex-row gap-x-5 pt-2">
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name="calendar-outline" size={20} color="#ccc" />
                                    <Text className="text-xs text-white/60 pl-2">{contract.startDate.toDate().toLocaleDateString("es-MX")}</Text>
                                </View>
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name={contract.paymentMethod as string === "effective" ? "cash-outline" : "card-outline"} size={20} color="#ccc" />
                                    <Text className="text-xs text-white/60 pl-2">{contract.paymentMethod as string === "effective" ? "Efectivo" : "Tarjeta"}</Text>
                                </View>
                                {
                                    contract.paymentMethod === "card" && (
                                        <View className="flex-row items-center mb-2">
                                            <Ionicons name={!showPaymentButton ? "checkmark-circle-outline" : "close-circle-outline"} size={20} color="#ccc" />
                                            <Text className="text-xs text-white/60 pl-2">{!showPaymentButton ? "Pagado" : "No pagado"}</Text>
                                        </View>
                                    )
                                }
                            </View>
                        </View>
                        <View className="border-b border-gray-300/10" />
                        <View>
                            <UserContact provider={user?.profileStatus === "client" ? contract.provider : contract.client} />
                        </View>
                        <View className="border-b border-gray-300/10" />

                        <View>
                            <Text className="font-semibold text-lg text-white">Imagenes de referencia</Text>
                            <Gallery images={contract.referenceImages as string[]} />
                        </View>

                        <View className="border-b border-gray-300/10" />

                        <View>
                            <Text className="font-semibold text-lg text-white">Ubicación</Text>
                            <View className="flex-row items-center gap-x-2">
                                <Ionicons name="location-sharp" size={16} color="#3D5DC7" />
                                <Text className="text-sm text-white/60">
                                    {contract.address.streetAddress} / {contract.address.neighborhood}
                                </Text>
                            </View>

                            <View className="mt-4 rounded-xl overflow-hidden h-48 w-full">
                                <MapView
                                    customMapStyle={mapCustomStyle}
                                    style={{ flex: 1 }}
                                    region={{
                                        latitude: contract.address.latitude as number,
                                        longitude: contract.address.longitude as number,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    }}
                                >
                                    <MapMarker
                                        coordinate={{
                                            latitude: contract.address.latitude as number,
                                            longitude: contract.address.longitude as number,
                                        }}
                                    />
                                </MapView>
                            </View>
                        </View>
                        <View className="border-b border-gray-300/10" />

                        <OfferTimeline offers={contract.offers} />

                        <View className="border-b border-gray-300/10" />

                        <View className="mb-8 pb-16">
                            <Text className="font-semibold text-lg text-white pb-2">Publicación</Text>
                            {contract.post && contract.post.id !== "deleted" ? (
                                <PostItemCard
                                    postId={contract.post.id}
                                    onPress={() => handleTouchPost(contract.post.id)}
                                    image={contract.post.images[0]}
                                    title={contract.post.title}
                                    neighborhood={contract.post.address.neighborhood}
                                    provider={contract.post.provider.name}
                                    service={contract.post.service}
                                    rate={contract.post.valoration}
                                />
                            ) : (
                                <View className="items-center py-8">
                                    <Ionicons name="alert-circle-outline" size={60} color="#fff" />
                                    <Text className="text-white/80 mt-4 text-xl font-semibold text-center">
                                        Este contrato pertenece a una publicación eliminada.
                                    </Text>
                                    <Text className="text-white/60 mt-2 text-sm text-center">
                                        Ya no es posible ver los detalles de la publicación, pero puedes consultar la información del contrato.
                                    </Text>
                                </View>
                            )}
                        </View>

                    </View>
                </View>
            </ScrollView>

            {contract && (
                <View className="absolute bottom-6 right-4 items-end space-y-3">
                    {/* PROVEEDOR - contrato pendiente */}
                    {user?.profileStatus === "provider" && contract.progressStatus === "pending" && (
                        <>
                            <CustomButton
                                className="bg-[#286741] rounded-full w-14 h-14 justify-center items-center shadow-lg mb-3"
                                onPress={() => {
                                    setConfirmAction(() => handleActiveContract);
                                    setModalVisible(true);
                                }}
                                icon={<Ionicons name="checkmark" size={24} color="#8DFAB9" />}
                            />
                            {
                                showPaymentButton && (
                                    <CustomButton
                                        className="bg-[#642E2E] rounded-full w-14 h-14 justify-center items-center shadow-lg"
                                        onPress={() => {
                                            setConfirmAction(() => handleCancelContract);
                                            setModalVisible(true);
                                        }}
                                        icon={<Ionicons name="close" size={24} color="#E4A2A2" />}
                                    />

                                )
                            }
                        </>
                    )}

                    {/* PROVEEDOR - contrato activo */}
                    {user?.profileStatus === "provider" && contract.progressStatus === "active" && (
                        <>
                            <CustomButton
                                className="bg-[#286741] rounded-full w-14 h-14 justify-center items-center shadow-lg mb-3"
                                onPress={() => {
                                    setConfirmAction(() => handleFinishContract);
                                    setModalVisible(true);
                                }}
                                icon={<Ionicons name="checkmark-done" size={24} color="#8DFAB9" />}
                            />
                            {
                                showPaymentButton && (
                                    <CustomButton
                                        className="bg-[#642E2E] rounded-full w-14 h-14 justify-center items-center shadow-lg"
                                        onPress={() => {
                                            setConfirmAction(() => handleCancelContract);
                                            setModalVisible(true);
                                        }}
                                        icon={<Ionicons name="close" size={24} color="#E4A2A2" />}
                                    />

                                )
                            }
                        </>
                    )}

                    {/* CLIENTE - siempre puede cancelar si el contrato está pendiente */}
                    {user?.profileStatus === "client" && contract.progressStatus === "pending" && showPaymentButton && (
                        <CustomButton
                            className="bg-[#642E2E] rounded-full w-14 h-14 justify-center items-center shadow-lg"
                            onPress={() => {
                                setConfirmAction(() => handleCancelContract);
                                setModalVisible(true);
                            }}
                            icon={<Ionicons name="close" size={24} color="#E4A2A2" />}
                        />
                    )}

                    {/* CLIENTE - botón de pagar visible siempre que haya pago pendiente */}
                    {user?.profileStatus === "client" &&
                        contract.paymentMethod === "card" &&
                        showPaymentButton && (
                            <CustomButton
                                className="bg-[#3D5DC7] rounded-full w-14 h-14 justify-center items-center shadow-lg"
                                onPress={async () => {
                                    const { error } = await presentPaymentSheet();

                                    if (error) {
                                        if (error.code === "Canceled") {
                                            console.log("🟡 Usuario canceló el pago.");
                                        } else {
                                            console.error("❌ Error al procesar el pago:", error);
                                            toast?.show("Error al procesar el pago", "error", 3000);
                                        }
                                    } else {
                                        toast?.show("Pago exitoso", "success", 3000);
                                        setShowPaymentButton(false);
                                    }
                                }}
                                icon={<Ionicons name="card" size={24} color="white" />}
                            />
                        )}
                </View>
            )}






            <ConfirmModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={() => {
                    confirmAction();
                }}
            />

        </SingleEntityScreen >
    );
}
