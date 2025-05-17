import { SingleEntityScreen } from "@/components/SingleEntityScreen";
import { usePostStore } from "@/entities/posts";
import BackButton from "@/shared/components/BackButton";
import { CustomButton } from "@/shared/components/CustomButton";
import { Gallery } from "@/shared/components/Galery";
import MapScreen from "@/shared/components/MapScreen";
import SaveButton from "@/shared/components/SavedButton";
import { UserContact } from "@/shared/components/UserContact";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";

export default function Details() {
    const { id } = useLocalSearchParams();

    const posts = usePostStore((state) => state.posts);
    const post = posts.find((post) => post.id === id);

    return (
        <SingleEntityScreen>
            <Stack.Screen
                options={{
                    headerShown: false,
                }} />

            <ScrollView>

                <View className="w-full rounded-b-3xl overflow-hidden">
                    <View className="absolute z-10 bottom-5 left-5">
                        <Text className="font-semibold text-lg text-white">{post?.title}</Text>
                        <Text className="text-sm text-white/60">{post?.service}</Text>
                    </View>

                    <View className="absolute z-10 top-5 right-5 bg-black/50 p-2 rounded-full">
                        <SaveButton />
                    </View>

                    <View className="absolute z-10 top-5 left-5 bg-black/50 p-2 rounded-full">
                        <BackButton />
                    </View>

                    <Image
                        source={{ uri: post?.images[0] }}
                        className="w-full h-[320px] bg-black/50 opacity-30"
                        resizeMode="cover"
                        alt={post?.title}
                    />
                </View>


                <View className="p-4">
                    <View className="flex-col gap-y-4">
                        <View>
                            <Text className="font-semibold text-lg text-white">Descripción</Text>
                            <Text className=" text-sm text-white/60">{post?.description}</Text>
                        </View>

                        <View className="flex-row items-center justify-start gap-x-1">
                            <View className={`self-start px-3 py-1.5 rounded-xl bg-neutral800/80`}>
                                <Text className={`text-xs font-bold uppercase text-primary-servilink`}>
                                    {post?.postType as string === "fix" ? "Fijo" : "Personalizado"}
                                </Text>
                            </View>

                            <View className="flex-row items-center gap-x-2">
                                <Ionicons
                                    name={"star"}
                                    size={20}
                                    color={"#FB9400"}
                                />
                                <Text className="text-sm text-white/60">{post?.valoration!.toString().includes(".") ? post?.valoration : post?.valoration + ".0"} (250 reviews)</Text>
                            </View>
                        </View>
                        <View>
                            <UserContact provider={post?.provider} />
                        </View>

                        <View>
                            <Gallery images={post?.images!} />
                        </View>

                        <View>
                            <Text className="font-semibold text-lg text-white">Ubicación</Text>
                            <View className="flex-row items-center gap-x-2 mb-2">
                                <Ionicons name="location-sharp" size={16} color="#3D5DC7" />
                                <Text className="text-sm text-white/60">{post?.address.streetAddress} / {post?.address.neighborhood}</Text>
                            </View>
                            <MapScreen address={"Calle: " + post?.address.streetAddress + ", colonia: " + post?.address.neighborhood + " codigo postal: " + post?.address.zipCode} />
                            {/* <View className="mt-4 rounded-xl overflow-hidden h-48 w-full">
                                <MapView
                                    style={{ flex: 1 }}
                                    region={{
                                        latitude: 24.15786698,
                                        longitude: -110.310119426,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    }}
                                >
                                    <MapMarker coordinate={{ latitude: 24.15786698, longitude: -110.310119426 }} />
                                </MapView>
                            </View> */}


                        </View>

                    </View>
                </View>

            </ScrollView>


            <View className="p-4 flex-row items-center justify-between bg-neutral800">
                <View className="flex-row items-center gap-x-2">
                    <Text className="text-lg text-white/60">
                        Precios
                    </Text>
                    <Text className="text-base text-white/90">
                        ${post?.minPrice} - {post?.maxPrice} MXN
                    </Text>
                </View>

                <CustomButton label="Contratar" onPress={() => { }} />


            </View>

        </SingleEntityScreen>
    )
}
