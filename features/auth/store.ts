import { useUserStore } from "@/entities/users";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: false,
  setAuth: (isAuthenticated: boolean) => set({ isAuthenticated }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  logout: () => {
    set({ isAuthenticated: false });
    useUserStore.getState().clearUser();
  },
}));
