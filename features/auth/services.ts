import { TUser, TUserType } from "@/entities/users";
import { auth, db } from "@/lib/firebaseConfig";
import { mapFirestoreUserToTUser } from "@/mappers/firebaseAuthToUser";
import { TAddress } from "@/shared/interfaces";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type RegisterUserProps = {
    email: string;
    password: string;
    name: string;
    lastname: string;
    secondLastname?: string;
    phoneNumber: string;
    address?: TAddress | null;
    profileStatus: TUserType;
    imageProfile?: string;
    birthDate: Date | null;
    providerId?: string | null;
};


export const loginUser = async (
    email: string,
    password: string
): Promise<TUser> => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const uid = result.user.uid;

        const userSnap = await getDoc(doc(db, "users", uid));
        if (!userSnap.exists()) throw new Error("Usuario no encontrado en Firestore");

        const userData: TUser = mapFirestoreUserToTUser({
            id: userSnap.id,
            ...userSnap.data()
        });

        return userData;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async ({ email,
    password,
    name,
    lastname,
    secondLastname = "",
    phoneNumber,
    address = null,
    profileStatus = "client",
    imageProfile = "",
    birthDate = null,
    providerId = null
}: RegisterUserProps) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const uid = result.user.uid;

        const userDoc = {
            name,
            lastname,
            second_lastname: secondLastname,
            address,
            phone_number: phoneNumber,
            email,
            status: true,
            profile_status: profileStatus,
            image_profile: imageProfile,
            birth_date: birthDate,
            provider_id: providerId
        };

        await setDoc(doc(db, "users", uid), userDoc);
        return result.user;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        return true;
    } catch (error) {
        throw error;
    }
};
/* 
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, new auth.GoogleAuthProvider());
    return result.user;
  } catch (error) {
    throw error;
  }
};
 */
