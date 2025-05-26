import { TUser } from "@/entities/users";
import { auth, db } from "@/lib/firebaseConfig";
import { storage } from "@/lib/firebaseStorageConfig";
import { mapFirestoreUserToTUser } from "@/mappers/firebaseAuthToUser";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, verifyBeforeUpdateEmail } from "firebase/auth";
import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const listenToUserChanges = (
  userId: string,
  onUpdate: (user: TUser) => void
) => {
  const ref = doc(db, "users", userId);
  return onSnapshot(ref, async (snap) => {
    if (!snap.exists()) return;
    const userData = snap.data();
    let providerData = null;
    if (userData.profile_status === "provider" && userData.provider_id) {
      const providerSnap = await getDoc(userData.provider_id);
      if (providerSnap.exists()) {
        const providerRaw = providerSnap.data();
        providerData = providerRaw ? {
          ...providerRaw,
          id: providerSnap.id
        } : null;
      }
    }
    const mappedUser = mapFirestoreUserToTUser({
      ...userData,
      id: snap.id,
      provider: providerData,
    });
    console.log("📦 User completo:", mappedUser);
    onUpdate(mappedUser);
  });
};

export const updateUserFields = async (userId: string, fields: Partial<TUser>) => {
  const ref = doc(db, "users", userId);
  await updateDoc(ref, fields);
};

export const uploadProfileImage = async (uri: string, userId: string): Promise<string> => {
  try {
    const fileName = uri.split("/").pop();
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageRef = ref(storage, `profile_images/${userId}_${Date.now()}.jpg`);
    await uploadBytes(imageRef, blob);

    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error("Error al subir la imagen de perfil:", error);
    throw error;
  }
}

export const deleteProfileImage = async (imageUrl: string): Promise<void> => {
  try {
    const pathStart = imageUrl.indexOf("/o/") + 3;
    const pathEnd = imageUrl.indexOf("?alt=");

    const filePath = decodeURIComponent(imageUrl.substring(pathStart, pathEnd));
    const imageRef = ref(storage, filePath);

    await deleteObject(imageRef);
  } catch (error) {
    console.warn("No se pudo eliminar la imagen del perfil:", error);
  }
};

export const changePassword = async (newPassword: string) => {
  const user = auth.currentUser;
  if (user) {
    try {
      await updatePassword(user, newPassword);
      console.log("Contraseña actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
    }
  }
};

export const changeEmail = async (newEmail: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  try {
    await verifyBeforeUpdateEmail(user, newEmail);
    console.log("Correo de verificación enviado al nuevo email");
  } catch (error) {
    console.error("Error al iniciar verificación de email:", error);
    throw error;
  }
};

export const reauthenticateUser = async (email: string, password: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("Usuario no autenticado");

  const credential = EmailAuthProvider.credential(email, password);
  await reauthenticateWithCredential(user, credential);
};

export const emailExistsInFirestore = async (email: string) => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const updateProviderRFC = async (userId: string, rfc: string, providerId: string) => {
  try {
    console.log("✅ Iniciando update RFC");
    const providerRef = doc(db, "providers", providerId);
    await updateDoc(providerRef, { rfc });
    console.log("✅ RFC actualizado en provider");

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { profile_status: "provider" });
    console.log("✅ Perfil actualizado a provider");
  } catch (err) {
    console.error("🔥 Error exacto:", err);
    throw err;
  }
};

export const updateProviderStatus = async (userId: string, status: "client" | "provider") => {
  try {
    console.log("✅ Iniciando update provider status");
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { profile_status: status });
    console.log(`✅ Perfil actualizado a ${status}`);
  } catch (err) {
    console.error("🔥 Error exacto:", err);
    throw err;
  }
};