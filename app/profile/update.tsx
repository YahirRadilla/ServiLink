import { Screen } from "@/components/Screen";
import { useUserStore } from "@/entities/users";
import { changeEmail, changePassword, deleteProfileImage, reauthenticateUser, updateUserFields, uploadProfileImage } from "@/features/users/services";
import { auth } from "@/lib/firebaseConfig";
import BackButton from "@/shared/components/BackButton";
import { CustomButton } from "@/shared/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Alert, Dimensions, Image, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import * as Yup from "yup";
import AddressTab from "./tabs/addressInfo";
import PersonalInfoTab from "./tabs/personalInfo";
// @ts-ignore
import Avatar from "../../shared/svg/avatar.svg";

const schema = Yup.object({
  name: Yup.string().required("Campo requerido"),
  lastName: Yup.string().required("Campo requerido"),
  email: Yup.string().email("Correo inválido").required("Campo requerido"),
  phone: Yup.string().min(10, "Ingresa un número de telefono de 10 dígitos").required("Campo requerido"),
  birthDate: Yup.date().required("Campo requerido"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Campo requerido"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Campo requerido"),
  neighborhood: Yup.string().required("Campo requerido"),
  streetAddress: Yup.string().required("Campo requerido"),
  zipCode: Yup.string().required("Campo requerido"),
  /* currentPassword: Yup.string().when(['email', 'password'], {
    is: (email: string, password: string) => !!email || !!password,
    then: Yup.string().required("Debes confirmar tu contraseña actual"),
  }), */
  currentPassword: Yup.string().when("password", (password, schema) => {
    return !!password && password.length >= 6
      ? schema.required("Debes confirmar tu contraseña actual")
      : schema.notRequired();
  }),
});


export default function UpdateProfileScreen() {
  const user = useUserStore((state) => state.user);
  const [profileImage, setProfileImage] = useState(user?.imageProfile || "");

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || "",
      lastName: user?.lastname || "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
      birthDate: user?.birthDate ? new Date(user.birthDate) : new Date(),
      password: "",
      confirmPassword: "",
      neighborhood: user?.address?.neighborhood || "",
      streetAddress: user?.address?.streetAddress || "",
      zipCode: user?.address?.zipCode || "",
      currentPassword: "",
    },
  });

  const { control, handleSubmit, formState: { errors } } = methods;
  const layout = Dimensions.get("window");
  const [index, setIndex] = React.useState(0);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      return Alert.alert("Permiso requerido", "Se necesita acceso a la galería");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: false,
      selectionLimit: 1,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const routes = [
    { key: "personal", title: "Información Personal" },
    { key: "address", title: "Dirección" },
  ];

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "personal":
        return <PersonalInfoTab />;
      case "address":
        return <AddressTab />;
      default:
        return null;
    }
  };
 //TO-DO
  const onUpdate = async (data: any) => {
    if (!user?.id) return Alert.alert("Error", "No se encontró el usuario");

    try {
      const previousImageUrl = user.imageProfile;
      let imageUrl = previousImageUrl;

      const userAuth = auth.currentUser;
      const isPasswordUser = userAuth?.providerData.some(p => p.providerId === "password");

      const isNewImage =
        profileImage &&
        profileImage !== previousImageUrl &&
        !profileImage.startsWith("https://");

      const isImageRemoved = !profileImage && !!previousImageUrl;

      // Reautenticación si se quiere cambiar email o password
      if ((data.password.length >= 6 || data.email !== user.email)) {
        try {
          await reauthenticateUser(user.email || "", data.currentPassword);
        } catch (error) {
          Alert.alert("Error", "La contraseña actual es incorrecta.");
          return;
        }
      }
      await auth.currentUser?.reload();
      console.log("Verificado:", auth.currentUser?.emailVerified);
      // Cambiar correo si es distinto
      if (isPasswordUser && data.email !== user.email) {
        try {
          await changeEmail(data.email);

          // Revisa si ya está verificado (opcional)
          await auth.currentUser?.reload();
          const verified = auth.currentUser?.emailVerified;

          if (!verified) {
            Alert.alert(
              "Verificación enviada",
              "Hemos enviado un correo de verificación a tu nuevo email. Revisa tu bandeja de entrada o spam."
            );
          }
        } catch (error) {
          Alert.alert("Error", "No se pudo cambiar el correo. Intenta más tarde.");
        }
      }

      // Cambiar contraseña si aplica
      if (isPasswordUser && data.password?.length >= 6) {
        await changePassword(data.password);
      }

      // Subir nueva imagen si aplica
      if (isNewImage) {
        imageUrl = await uploadProfileImage(profileImage, user.id);
      }
      // Actualizar campos de usuario
      const payload = {
        name: data.name,
        lastname: data.lastName,
        email: auth.currentUser?.email || user.email,
        phone_number: data.phone,
        birth_date: data.birthDate,
        image_profile: isImageRemoved ? "" : imageUrl,
        address: {
          neighborhood: data.neighborhood,
          streetAddress: data.streetAddress,
          zipCode: data.zipCode,
        },
      };

      await updateUserFields(user.id, payload);

      // Eliminar imagen anterior si fue reemplazada o removida
      if (
        previousImageUrl &&
        previousImageUrl.startsWith("https://") &&
        (isNewImage || isImageRemoved)
      ) {
        await deleteProfileImage(previousImageUrl);
      }

      Alert.alert("Perfil actualizado correctamente");
    } catch (error: any) {
      console.error("❌ Error al actualizar el perfil:", error);
      Alert.alert("Error", error.message || "No se pudo actualizar el perfil");
    }
  };



  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="ml-14 p-4">
        <Text className="text-white font-bold text-xl">Editar Perfil</Text>
      </View>
      <View className="items-center mb-2 space-y-2">
        <Pressable onPress={handlePickImage} className="relative">
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              className="w-24 h-24 rounded-full border border-white/10"
            />
          ) : (
            <Avatar
              width={96}
              height={96}
              style={{
                borderRadius: 9999,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
            />
          )}
          {profileImage && (
            <Pressable
              onPress={() => setProfileImage("")}
              className="absolute -right-3 -top-3 p-1.5 rounded-full "
              hitSlop={5}
            >
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </Pressable>
          )}
          <View className="absolute bottom-1 right-1 bg-black/60 p-1 rounded-full border border-white/10">
            <Ionicons name="create" size={16} color="white" />
          </View>
        </Pressable>
        <Text className="text-white/60 text-sm">Toca para cambiar la imagen</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <FormProvider {...methods}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            style={{ flex: 1 }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                style={{ backgroundColor: "#161622" }}
                indicatorStyle={{
                  backgroundColor: "#3D5DC7",
                  height: 3,
                  borderRadius: 2,
                }}
                activeColor="#fff"
                inactiveColor="#888"
                pressColor="#3D5DC7"
              />
            )}
          />
        </FormProvider>
      </KeyboardAvoidingView>

      <View
        className="px-4 pt-4 pb-4 bg-primarybg-servilink"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
        }}
      >
        <CustomButton label="Guardar Cambios" onPress={handleSubmit(onUpdate)} />
      </View>

      <View className="absolute z-10 top-5 left-5 bg-black/50 p-2 rounded-full">
        <BackButton />
      </View>
    </Screen>
  );
}
