import { TProvider } from '@/entities/providers';
import { TUser, TUserType, useUserStore } from '@/entities/users';
import { auth, db } from '@/lib/firebaseConfig';
import { mapFirestoreUserToTUser } from '@/mappers/firebaseAuthToUser';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useAuthStore } from './store';

export const useGoogleLogin = () => {
    const { setUser } = useUserStore();
    const { setAuth, setLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '441884552116-nue6o6l02l9hdfkgqbjrr31t7ko9me63.apps.googleusercontent.com',
        });
    }, []);

    const loginWithGoogle = async () => {
        try {
            setLoading(true);

            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const { idToken } = await GoogleSignin.getTokens();
            if (!idToken) throw new Error('No se recibió el idToken');

            const credential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(auth, credential);

            const uid = userCredential.user.uid;
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);

            let userData: TUser;

            if (!userSnap.exists()) {

                const providerDocRef = await addDoc(collection(db, 'providers'), {
                    rfc: null,
                    servicesOffered: null,
                    status: false,
                });

                const providerSnap = await getDoc(providerDocRef);

                const providerData: TProvider = {
                    id: providerSnap.id,
                    ...(providerSnap.data() as Omit<TProvider, 'id'>),
                };

                const userDoc = {
                    name: userCredential.user.displayName ?? '',
                    lastname: '',
                    second_lastname: '',
                    address: null,
                    phone_number: userCredential.user.phoneNumber ?? null,
                    email: userCredential.user.email ?? '',
                    status: true,
                    profile_status: 'client' as TUserType,
                    image_profile: userCredential.user.photoURL ?? '',
                    birth_date: null,
                    provider_id: doc(db, 'providers', providerDocRef.id),
                };
                console.log(userDoc);
                await setDoc(userRef, userDoc);



                userData = {
                    id: uid,
                    name: userDoc.name,
                    lastname: userDoc.lastname,
                    secondLastname: userDoc.second_lastname,
                    address: userDoc.address,
                    phoneNumber: userDoc.phone_number,
                    email: userDoc.email,
                    status: userDoc.status,
                    profileStatus: userDoc.profile_status,
                    imageProfile: userDoc.image_profile,
                    birthDate: userDoc.birth_date,
                    provider: providerData,
                };
            } else {

                const rawUser = userSnap.data();

                const providerRef = rawUser.provider_id;
                const providerSnap = await getDoc(providerRef);

                const providerData: TProvider = {
                    id: providerSnap.id,
                    ...(providerSnap.data() as Omit<TProvider, 'id'>),
                };

                const parsedUser = mapFirestoreUserToTUser({
                    id: userSnap.id,
                    ...rawUser,
                });

                userData = {
                    ...parsedUser,
                    provider: providerData,
                };

            }

            setUser(userData);
            setAuth(true);
            router.replace('/(app)/(tabs)');
        } catch (error) {
            console.error('Error en login con Google:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        loginWithGoogle,
    };
};
