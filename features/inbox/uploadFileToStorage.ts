import { storage } from "@/lib/firebaseStorageConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadFileToStorage = async (
  localUri: string,
  folder: "chat-images" | "chat-videos"
): Promise<string> => {
  try {
    const fileName = localUri.split("/").pop();
    const response = await fetch(localUri);
    const blob = await response.blob();

    const fileRef = ref(storage, `${folder}/${Date.now()}-${fileName}`);
    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error("Error al subir archivo:", error);
    throw error;
  }
};
