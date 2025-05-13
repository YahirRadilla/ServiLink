import { create } from 'zustand';
import { TUser } from './entity';

type UserState = {
    user: TUser | null;
    setUser: (user: TUser) => void;
    clearUser: () => void;
};

export const useUserStore = create<UserState>((set, get) => ({
    user:null,
    setUser: (user: TUser) => set({ user }),
    clearUser: () => set({ user: null }),
}))