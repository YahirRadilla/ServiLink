import { TUser } from "@/entities/users";
import { db } from "@/lib/firebaseConfig";
import { storage } from "@/lib/firebaseStorageConfig";
import { mapFirestoreUserToTUser } from "@/mappers/firebaseAuthToUser";
import { doc, onSnapshot, updateDoc, } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const listenToUserChanges = (
  userId: string,
  onUpdate: (user: TUser) => void
) => {
  const ref = doc(db, "users", userId);
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) return;
    const data = mapFirestoreUserToTUser({ ...snap.data(), id: snap.id });
    onUpdate(data);
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