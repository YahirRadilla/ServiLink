import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import ImageViewing from "react-native-image-viewing";

export function Gallery({ images }: { images: string[] }) {
    const [visible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    console.log(images);
    const displayedImages = images.map((uri) => ({ uri })) || [];

    return (
        <View>
            <Text className="font-semibold text-lg text-white">Galería</Text>
            <View className="pt-2">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row items-center gap-x-2">
                        {images.map((image, index) => (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    setCurrentIndex(index);
                                    setIsVisible(true);
                                }}
                            >
                                <Image
                                    source={{ uri: image }}
                                    className="w-32 h-32 rounded-xl bg-black"
                                    resizeMode="cover"
                                />
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            </View>

            <ImageViewing
                images={displayedImages}
                imageIndex={currentIndex}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
            />
        </View>
    );
}
