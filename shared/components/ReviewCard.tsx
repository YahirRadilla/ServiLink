import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import { Gallery } from "./Galery";

const user = {
  name: "Juan Perez",
  imageProfile:
    "https://plus.unsplash.com/premium_photo-1664299749481-ac8dc8b49754?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  referenceImages: [
    "https://images.pexels.com/photos/1472999/pexels-photo-1472999.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/3687957/pexels-photo-3687957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1770918/pexels-photo-1770918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/982300/pexels-photo-982300.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ],
  textContent: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente ipsam quam officia, est delectus debitis reprehenderit maxime omnis cumque repellendus accusamus dolores facilis, natus, quae fugit tempora quo odit. Maxime. Provident sapiente laudantium reprehenderit sunt veritatis repudiandae quam, officiis cumque aut unde dolorem dignissimos sequi illum id ex doloribus aperiam commodi omnis minima fugit. Labore ducimus enim nulla dolore suscipit. ",
  date: "2025-5-020T12:00:00Z",
  post: {
    id: "1",
    name: "Yahir Radilla",
    service: "Plomería",
    rating: 1,
  },
};

export function ReviewCard({}: {}) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((prev) => !prev);

  const renderStars = () => {
    const stars = [];
    /* get the rating from the post */
    const rating = user.post.rating;
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < rating ? "star" : "star-outline"}
          size={16}
          color="#FB9400"
        />
      );
    }
    return stars;
  };
  return (
    <View className="gap-y-2">
      <View className="">
        <View className="flex-row items-center">
          <Image
            source={{
              uri:
                user.imageProfile ||
                "https://firebasestorage.googleapis.com/v0/b/servilink-68398.firebasestorage.app/o/user-placeholder.png?alt=media&token=f1ee8fe8-276f-4b86-9ee9-ffce09655e01",
            }}
            className="w-10 h-10 rounded-full mr-3"
            resizeMode="cover"
            alt="Imagen de perfil"
          />
          <View>
            <Text className="font-semibold text-lg text-white">
              {user?.name}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row justify-between items-center p-0.5">
          <View className="flex-row">{renderStars()}</View>
        </View>
        <View>
          <Text className="text-white">-</Text>
        </View>
        <View>
          <Text className="text-white/60 text-xs">
            {new Date(user.date).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
        <View>
          <Text className="text-white">-</Text>
        </View>
        <View>
          <Text className="text-white/60 text-xs">{user.post.name}</Text>
        </View>
        <View>
          <Text className="text-white">-</Text>
        </View>
        <View>
          <Text className="text-white/60 text-xs">{user.post.service}</Text>
        </View>
      </View>
      <View>
        <Text className="text-white text-base" numberOfLines = {expanded ? undefined : 4}>{user.textContent}</Text>
        {user.textContent.length > 150 && (
            <Text onPress={toggleExpanded} className="text-links-servilink font-semibold"> {expanded ? "Ver menos":"Ver más"}</Text>
        )}
      </View>
      <View>
        <Gallery images={user.referenceImages} size={24} />
      </View>
    </View>
  );
}
