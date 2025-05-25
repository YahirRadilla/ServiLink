import { TUser } from "@/entities/users";
import { db } from "@/lib/firebaseConfig";
import { mapFirestoreUserToTUser } from "@/mappers/firebaseAuthToUser";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

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
