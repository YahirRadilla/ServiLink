import { TUser, useUserStore } from '@/entities/users';
import { auth, db } from '@/lib/firebaseConfig';
import { mapFirestoreUserToTUser } from '@/mappers/firebaseAuthToUser';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useAuthStore } from './store';



WebBrowser.maybeCompleteAuthSession();

export const useGoogleLogin = () => {
    const { setUser } = useUserStore();
    const { setAuth, setLoading } = useAuthStore();
    const router = useRouter();
    const redirectUri = makeRedirectUri({ useProxy: true });






    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '441884552116-nue6o6l02l9hdfkgqbjrr31t7ko9me63.apps.googleusercontent.com',
        scopes: ['openid', 'email', 'profile'],
        redirectUri: redirectUri
    });
    console.log('🔗 redirectUri:', redirectUri);
    useEffect(() => {
        const handleGoogleResponse = async () => {
            if (response?.type === 'success') {
                try {
                    setLoading(true);
                    const { id_token } = response.params;
                    const credential = GoogleAuthProvider.credential(id_token);
                    const userCredential = await signInWithCredential(auth, credential);

                    const uid = userCredential.user.uid;
                    const userSnap = await getDoc(doc(db, 'users', uid));
                    if (!userSnap.exists()) throw new Error('Usuario no encontrado');

                    const userData: TUser = mapFirestoreUserToTUser({
                        id: userSnap.id,
                        ...userSnap.data(),
                    });

                    setUser(userData);
                    setAuth(true);
                    router.replace('/(app)/(tabs)');
                } catch (err) {
                    console.error('Error con Google Sign In:', err);
                } finally {
                    setLoading(false);
                }
            }
        };

        handleGoogleResponse();
    }, [response]);

    return {
        promptAsync,
        request,
    };
};
