import { TUser, TUserType } from "@/entities/users";
import { auth, db } from "@/lib/firebaseConfig";
import { mapFirestoreUserToTUser } from "@/mappers/firebaseAuthToUser";
import { TAddress } from "@/shared/interfaces";
import * as WebBrowser from 'expo-web-browser';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { addDoc, collection, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";

WebBrowser.maybeCompleteAuthSession();


const provider = new GoogleAuthProvider();



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
    password: string,
    onUserUpdate: (user: TUser) => void
): Promise<() => void> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;

    const userRef = doc(db, "users", uid);

    return new Promise((resolve, reject) => {
        const unsub = onSnapshot(userRef, async (snap) => {
            if (!snap.exists()) return reject(new Error("Usuario no encontrado."));

            const data = snap.data();

            if (data.status === false) {
                return reject(new Error("Usuario deshabilitado."));
            }

            let providerData = null;

            if (data.provider_id) {
                const providerSnap = await getDoc(data.provider_id);
                const providerDataRaw = providerSnap.data();
                providerData = providerDataRaw ? { ...providerDataRaw, provider_id: providerSnap.id } : null;
            }

            const user = mapFirestoreUserToTUser({
                id: snap.id,
                ...data,
                provider: providerData,
            });

            onUserUpdate(user);
            resolve(unsub);
        }, reject);
    });
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

        const providerDoc = await addDoc(collection(db, "providers"), {
            rfc: null,
            servicesOffered: null,
            status: false,
        });

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
            provider_id: doc(db, "providers", providerDoc.id)
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

export async function saveExpoPushToken(token: string) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await setDoc(doc(db, 'users', uid), {
        pushToken: token
    }, { merge: true })
}

