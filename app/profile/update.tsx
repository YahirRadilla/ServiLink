import { Screen } from "@/components/Screen";
import { useUserStore } from "@/entities/users";
import { changePassword, deleteProfileImage, emailExistsInFirestore, reauthenticateUser, updateUserFields, uploadProfileImage } from "@/features/users/services";
import { auth } from "@/lib/firebaseConfig";
import BackButton from "@/shared/components/BackButton";
import { CustomButton } from "@/shared/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Burnt from "burnt";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import * as Yup from "yup";
import AddressTab from "./tabs/addressInfo";
import AuthInfoTab from "./tabs/authInfo";
import PersonalInfoTab from "./tabs/personalInfo";
// @ts-ignore
import Avatar from "../../shared/svg/avatar.svg";

const schema = (userEmail: string) => Yup.object({
  name: Yup.string().required("Campo requerido"),
  lastName: Yup.string().required("Campo requerido"),
  secondLastname: Yup.string().notRequired(),
  phone: Yup.string().min(10, "Ingresa un número de telefono de 10 dígitos").required("Campo requerido"),
  birthDate: Yup.date().required("Campo requerido"),
  neighborhood: Yup.string(),
  streetAddress: Yup.string(),
  zipCode: Yup.string(),
  email: Yup.string().email("Correo inválido"),
  password: Yup.string()
    .transform((value) => (value === "" ? undefined : value))
    .min(6, "Mínimo 6 caracteres")
    .notRequired(),
  confirmPassword: Yup.string()
    .when("password", {
      is: (password: string) => !!password,
      then: (schema) =>
        schema
          .required("Confirma tu nueva contraseña")
          .oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),
      otherwise: (schema) => schema.notRequired(),
    }),
  currentPassword: Yup.string().when(["email", "password", "confirmPassword"], {
    is: (email: string, password: string, confirmPassword: string, schema: any) => {
      const emailChanged = !!email && userEmail !== email;
      const passwordChanged = !!password || !!confirmPassword;

      return emailChanged || passwordChanged;
    },
    then: (schema) =>
      schema.required("Debes confirmar tu contraseña actual"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function UpdateProfileScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useUserStore((state) => state.user);
  const [profileImage, setProfileImage] = useState(user?.imageProfile || "");
  const methods = useForm({
    resolver: yupResolver(schema(user?.email || "")),
    defaultValues: {
      name: user?.name || "",
      lastName: user?.lastname || "",
      secondLastname: user?.secondLastname || "",
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
      return Burnt.toast({
        title: "Permiso denegado",
        message: "Necesitamos acceso a tu galería para seleccionar una imagen.",
        preset: "error",
        from: "top"
      })
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
    { key: "auth", title: "Credenciales" }
  ];

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "personal":
        return <PersonalInfoTab />;
      case "address":
        return <AddressTab />;
      case "auth":
        return <AuthInfoTab />;
      default:
        return null;
    }
  };

  const onUpdate = async (data: any) => {
    Keyboard.dismiss();
    if (!user?.id) return Burnt.toast({
      title: "Error",
      message: "Usuario no encontrado",
      preset: "error",
      from: "top"
    })
    setIsSubmitting(true);
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

      // Subir nueva imagen si aplica
      if (isNewImage) {
        imageUrl = await uploadProfileImage(profileImage, user.id);
      }

      // Eliminar imagen anterior si fue reemplazada o removida
      if (
        previousImageUrl &&
        previousImageUrl.startsWith("https://") &&
        (isNewImage || isImageRemoved)
      ) {
        await deleteProfileImage(previousImageUrl);
      }

      if (data.email !== user.email) {
        const exists = await emailExistsInFirestore(data.email);
        if (exists) {
          Burnt.toast({
            title: "Correo ya registrado",
            message: "El correo electrónico ya está en uso por otro usuario.",
            preset: "error",
            from: "top"
          })
          setIsSubmitting(false);
          return;
        }
      }
      // Reautenticación si se quiere cambiar email o password
      if ((data.password?.length >= 6 || data.email !== user.email)) {
        try {
          await reauthenticateUser(user.email || "", data.currentPassword);
        } catch (error) {
          Burnt.toast({
            title: "Error de autenticación",
            message: "La contraseña actual es incorrecta.",
            preset: "error",
            from: "top"
          });
          setIsSubmitting(false);
          return;
        }
      }
      const payload = {
        name: data.name,
        lastname: data.lastName,
        second_lastname: data.secondLastname,
        email: data.email,
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

      await auth.currentUser?.reload();
      console.log("Verificado:", auth.currentUser?.emailVerified);
      // Cambiar contraseña si aplica
      if (isPasswordUser && data.password?.length >= 6) {
        await changePassword(data.password);
      }
      Burnt.toast({
        title: "Perfil actualizado correctamente",
        preset: "done",
        haptic: "success",
        shouldDismissByDrag: true,
        from: "top",
      });
    } catch (error: any) {
      console.error("❌ Error al actualizar el perfil:", error);
      Burnt.toast({
        title: "Error al actualizar el perfil",
        message: error.message || "Ocurrió un error inesperado",
        preset: "error",
        from: "top"
      })
    } finally {
      setIsSubmitting(false);
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
                pressColor="#161622"
              />
            )}
          />
        </FormProvider>
      </KeyboardAvoidingView>

      <View className="px-4 pt-4 pb-4 bg-primarybg-servilink">
        <CustomButton
          label="Guardar Cambios"
          onPress={handleSubmit(onUpdate)}
          disabled={isSubmitting}
          loading={isSubmitting}
        />
      </View>

      <View className="absolute z-10 top-5 left-5 bg-black/50 p-2 rounded-full">
        <BackButton />
      </View>
    </Screen>
  );
}
