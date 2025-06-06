import { TUser } from "@/entities/users";
import { auth, db } from "@/lib/firebaseConfig";
import { storage } from "@/lib/firebaseStorageConfig";
import { mapFirestoreUserToTUser } from "@/mappers/firebaseAuthToUser";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, verifyBeforeUpdateEmail } from "firebase/auth";
import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where, writeBatch } from "firebase/firestore";
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
    /* console.log("✅ Iniciando update RFC"); */
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
    /* console.log("✅ Iniciando update provider status"); */
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { profile_status: status });
    console.log(`actualizado a ${status}`);
  } catch (err) {
    console.error("🔥 Error exacto:", err);
    throw err;
  }
};

export const disableUser = async (userId: string, providerId: string) => {
  console.log("🚨 Deshabilitando usuario", JSON.stringify({ userId, providerId }));
  const userRef = doc(db, "users", userId);
  const providerRef = doc(db, "providers", providerId);

  // Paso 1: Desactivar usuario
  await updateDoc(userRef, { status: false });

  const batch = writeBatch(db);

  // Paso 2: Posts (donde el user es provider)
  const postsRef = collection(db, "posts");
  const postsSnap = await getDocs(query(postsRef, where("provider_id", "==", providerRef)));
  postsSnap.forEach((doc) => {
    batch.update(doc.ref, { status: false });
  });

  // Paso 3: Proposals (donde el user es provider)
  const proposalsRef = collection(db, "proposals");
  const proposalsSnap = await getDocs(query(proposalsRef, where("provider_id", "==", userRef)));
  //TODO cambiar provider_id por client_id
  proposalsSnap.forEach((doc) => {
    const data = doc.data();
    if (data.accept_status === "pending") {
      batch.update(doc.ref, { accept_status: "rejected" });
    }
  });

  // Paso 4: Contracts (donde el user es provider)
  const contractsRef = collection(db, "contracts");
  const contractsSnap = await getDocs(query(contractsRef, where("provider_id", "==", userRef)));

  contractsSnap.forEach((doc) => {
    const data = doc.data();
    if (data.progress_status === "pending") {
      batch.update(doc.ref, { progress_status: "cancelled" });
    }
  });

  // Paso final: Confirmar todas las actualizaciones
  await batch.commit();
};


export const enableUser = async (userId: string, providerId: string) => {
  try {
    // Activar usuario
    const userRef = doc(db, "users", userId);
    const providerRef = doc(db, "providers", providerId);
    await updateDoc(userRef, { status: true });

    // Activar posts del usuario
    const postsQuery = query(
      collection(db, "posts"),
      where("provider_id", "==", providerRef)
    );
    const postsSnap = await getDocs(postsQuery);
    const postsBatch = writeBatch(db);
    postsSnap.forEach((postDoc) => {
      postsBatch.update(postDoc.ref, { status: true });
    });
    await postsBatch.commit();

    // ⚠ Opcional: restaurar propuestas (si aplica una lógica)
    // Por ahora, no cambiaremos el `accept_status` de proposals ni `progress_status` de contracts
    // para evitar inconsistencias con el flujo del negocio.

    console.log("✅ Usuario reactivado correctamente.");
  } catch (error) {
    console.error("❌ Error al habilitar usuario:", error);
    throw error;
  }
};