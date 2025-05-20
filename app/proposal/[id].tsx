import { SingleEntityScreen } from "@/components/SingleEntityScreen";
import { useProposalById } from "@/features/proposals/useProposal";
import BackButton from "@/shared/components/BackButton";
import { Gallery } from "@/shared/components/Galery";
import { UserContact } from "@/shared/components/UserContact";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { ScrollView, Text, View } from "react-native";
import MapView, { MapMarker } from "react-native-maps";

export default function ProposalDetails() {
    const { id } = useLocalSearchParams();
    const { proposal, loading } = useProposalById(id as string || null);

    console.log(proposal);

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
            <ScrollView className="pt-12">
                <View className="w-full rounded-b-3xl overflow-hidden">
                    <View className="absolute z-10 bottom-5 left-5">
                        <Text className="font-semibold text-lg text-white">{proposal.post.title}</Text>
                        <Text className="text-sm text-white/60">{proposal.post.service}</Text>
                    </View>
                </View>

                <View className="p-4">
                    <View className="flex-col gap-y-4 mb-24">

                        <View>
                            <Text className="font-semibold text-xl text-white">{proposal.post.title}</Text>

                        </View>
                        <View>
                            <Text className="font-semibold text-lg text-white">Descripción</Text>
                            <Text className="text-sm text-white/60">{proposal.description}</Text>
                        </View>


                        <View>
                            <UserContact provider={proposal.client} />
                        </View>
                        <View>
                            <Text className="font-semibold text-lg text-white">Imagenes de referencia</Text>
                            <Gallery images={proposal.referenceImages as string[]} />
                        </View>
                        <View>
                            <Text className="font-semibold text-lg text-white">Ubicación</Text>
                            <View className="flex-row items-center gap-x-2 mb-2">
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
                    </View>
                </View>
            </ScrollView>


        </SingleEntityScreen>
    );
}
