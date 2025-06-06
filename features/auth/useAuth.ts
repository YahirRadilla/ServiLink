import { usePostStore } from "@/entities/posts";
import { useUserStore } from "@/entities/users";
import { auth, db } from "@/lib/firebaseConfig";
import { mapFirestoreUserToTUser } from "@/mappers/firebaseAuthToUser";
import { registerForPushNotificationsAsync } from "@/shared/utils/registerForPushNotificationsAsync";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { enableUser } from "../users/services";
import { loginUser, logoutUser, registerUser, RegisterUserProps, saveExpoPushToken } from "./services";
import { useAuthStore } from "./store";

let unsubscribeUserSnapshot: (() => void) | null = null;

export const useAuth = () => {
    const { setAuth, setLoading, isLoading, logout, isAuthenticated } = useAuthStore();
    const { setUser } = useUserStore();


    useEffect(() => {
        setLoading(true);
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userRef = doc(db, "users", firebaseUser.uid);

                const unsub = onSnapshot(userRef, async (snap) => {
                    if (!snap.exists()) return;

                    const data = snap.data();

                    // Validar si está deshabilitado
                    if (data.status === false) {
                        setAuth(false);
                        return;
                    }

                    let providerData = null;
                    if (data.provider_id) {
                        const providerSnap = await getDoc(data.provider_id);
                        const providerDataRaw = providerSnap.data();
                        providerData = providerDataRaw
                            ? { ...providerDataRaw, provider_id: providerSnap.id }
                            : null;
                    }

                    const user = mapFirestoreUserToTUser({
                        id: snap.id,
                        ...data,
                        provider: providerData,
                    });

                    setUser(user);
                    setAuth(true);
                    unsubscribeUserSnapshot = unsub;
                    setLoading(false);
                });

            } else {
                setAuth(false);
                logout();
                setLoading(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            unsubscribeUserSnapshot = await loginUser(email, password, async (user) => {
                // Si el usuario está desactivado, lo reactivamos
                if (user.status === false && user.provider.id) {
                    await enableUser(user.id, user.provider.id);
                    user.status = true;
                }

                setUser(user);
                setAuth(true);

                const token = await registerForPushNotificationsAsync();
                if (token) {
                    await saveExpoPushToken(token);
                }
            });
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            if (unsubscribeUserSnapshot) {
                unsubscribeUserSnapshot();
                unsubscribeUserSnapshot = null;
            }

            await logoutUser();
            usePostStore.getState().clearPosts();
            usePostStore.getState().applyFilters({});
            setAuth(false);
            logout();
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterUserProps) => {
        setLoading(true);
        try {
            const user = await registerUser(data);
            const snap = await getDoc(doc(db, "users", user.uid));
            if (!snap.exists()) throw new Error("No se encontró el usuario tras el registro");

            const token = await registerForPushNotificationsAsync();
            if (token) {
                await saveExpoPushToken(token);
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        isAuthenticated,
        register,
        signOut,
        isLoading
    };
};
