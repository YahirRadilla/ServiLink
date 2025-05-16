import { usePostStore } from "@/entities/posts";
import { useUserStore } from "@/entities/users";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { loginUser, logoutUser, registerUser, RegisterUserProps } from "./services";
import { useAuthStore } from "./store";

export const useAuth = () => {
    const { setAuth, setLoading, logout, isAuthenticated } = useAuthStore();
    const { setUser } = useUserStore();

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const user = await loginUser(email, password);
            setUser(user);
            setAuth(true);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };


    const signOut = async () => {
        setLoading(true);
        try {
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
    }
    /* 
        const loginWithGoogle = async () => {
            setLoading(true);
            try {
                const { user } = await loginWithGoogleWithPopup();
                setUser(user);
                setAuth(true);
            } catch (error) {
                throw error;
            } finally {
                setLoading(false);
            }
        }; */

    const register = async (data: RegisterUserProps) => {
        setLoading(true);
        try {
            const user = await registerUser(data);

            const snap = await getDoc(doc(db, "users", user.uid));

            if (!snap.exists()) throw new Error("No se encontró el usuario tras el registro");

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
        signOut
    };
}