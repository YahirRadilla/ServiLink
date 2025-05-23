import { SingleEntityScreen } from "@/components/SingleEntityScreen";
import { useUserStore } from "@/entities/users";
import { useContractById } from "@/features/contracts/useContractById";
import BackButton from "@/shared/components/BackButton";
import { CustomButton } from "@/shared/components/CustomButton";
import { Gallery } from "@/shared/components/Galery";
import OfferTimeline from "@/shared/components/OfferTimeline";
import { PostItemCard } from "@/shared/components/PostItemCard";
import { StatusChip, StatusType } from "@/shared/components/StatusChip";
import { UserContact } from "@/shared/components/UserContact";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { ScrollView, Text, View } from "react-native";
import MapView, { MapMarker } from "react-native-maps";

export default function ContractDetails() {
    const { id } = useLocalSearchParams();
    const { contract, loading, error, refetch } = useContractById(id as string);
    const mapCustomStyle = [ { "elementType": "geometry", "stylers": [ { "color": "#242f3e" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#746855" } ] }, { "elementType": "labels.text.stroke", "stylers": [ { "color": "#242f3e" } ] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [ { "color": "#d59563" } ] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#d59563" } ] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#263c3f" } ] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#6b9a76" } ] }, { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#38414e" } ] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [ { "color": "#212a37" } ] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [ { "color": "#9ca5b3" } ] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#746855" } ] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#1f2835" } ] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [ { "color": "#f3d19c" } ] }, { "featureType": "transit", "elementType": "geometry", "stylers": [ { "color": "#2f3948" } ] }, { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [ { "color": "#d59563" } ] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#17263c" } ] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#515c6d" } ] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [ { "color": "#17263c" } ] } ]
    const user = useUserStore((state) => state.user);
    const router = useRouter();
    const handleTouchPost = (id: string) => {
        if (!id) return;
        router.push({
            pathname: "/post/[id]",
            params: { id },
        });
    };

    if (loading || !contract) {
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
                            </View>
                        </View>
                        <View className="border-b border-gray-300/10" />
                        <View>
                            <UserContact provider={contract.client} />
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
                            <PostItemCard
                                onPress={() => handleTouchPost(contract.post.id)}
                                image={contract.post.images[0]}
                                title={contract.post.title}
                                neighborhood={contract.post.address.neighborhood}
                                provider={contract.post.provider.name}
                                service={contract.post.service}
                                rate={contract.post.valoration}
                            />
                        </View>

                    </View>
                </View>
            </ScrollView>

            {contract.progressStatus === "pending" &&

                <View className="p-4 absolute bottom-0 w-full flex-row items-center justify-center bg-black/80">
                    {
                        ((contract.offers[contract.offers.length - 1].isClient && user?.profileStatus === "provider") || (!contract.offers[contract.offers.length - 1].isClient && user?.profileStatus === "client")) && (
                            <View className="flex-1 mr-2">
                                <CustomButton
                                    label="Contraofertar"
                                    className="bg-transparent border border-links-servilink rounded-xl"
                                    onPress={() => { }}
                                />
                            </View>
                        )
                    }

                    <View className="flex-1">
                        <CustomButton
                            label="Cancelar"
                            className="bg-red-700 rounded-xl"
                            onPress={() => { }}
                        />
                    </View>
                </View>

            }



        </SingleEntityScreen>
    );
}
