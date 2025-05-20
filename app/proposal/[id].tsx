import { SingleEntityScreen } from "@/components/SingleEntityScreen";
import { useProposalById } from "@/features/proposals/useProposal";
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

export default function ProposalDetails() {
    const { id } = useLocalSearchParams();
    const { proposal, loading } = useProposalById(id as string || null);

    const router = useRouter();
    const handleTouchPost = (id: string) => {
        if (!id) return;
        router.push({
            pathname: "/post/[id]",
            params: { id },
        });
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
            <View className="absolute z-10 top-5 left-5 bg-black/50 p-2 rounded-full">
                <BackButton />
            </View>
            <ScrollView className="p-1 pt-14">
                <View className="w-full rounded-b-3xl overflow-hidden">
                    <View className="absolute z-10 bottom-5 left-5">
                        <Text className="font-semibold text-lg text-white">{proposal.post.title}</Text>
                        <Text className="text-sm text-white/60">{proposal.post.service}</Text>
                    </View>
                </View>

                <View className="p-4">
                    <View className="flex-col gap-y-4 mb-24">

                        <View className="flex-row items-center justify-between">
                            <Text className="font-semibold text-xl text-white">{proposal.post.title}</Text>
                            <StatusChip type="proposal" status={proposal.acceptStatus as StatusType} />
                        </View>

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
                                    <Ionicons name={proposal.paymentMethod as string === "Efective" ? "cash-outline" : "card-outline"} size={20} color="#ccc" />
                                    <Text className="text-xs text-white/60 pl-2">{proposal.paymentMethod as string === "Efective" ? "Efectivo" : "Tarjeta"}</Text>
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
                        <View className="mb-4">
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

                        <View className="border-b border-gray-300/10" />

                        <OfferTimeline />
                    </View>
                </View>
            </ScrollView>

            {proposal.acceptStatus === "pending" &&

                <View className="p-4 absolute bottom-0 w-full flex-row items-center justify-center bg-black/80">
                    <View className="flex-1 mr-2">
                        <CustomButton
                            label="Contraofertar"
                            className="bg-transparent border border-links-servilink rounded-xl"
                            onPress={() => { }}
                        />
                    </View>
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
