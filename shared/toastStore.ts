import { IToast } from "@/shared/components/Toast";
import { create } from "zustand";

type ToastStore = {
    setToastRef: (ref: IToast) => void;
    toastRef: IToast | null;
};

export const useToastStore = create<ToastStore>((set) => ({
    toastRef: null,
    setToastRef: (ref) => set({ toastRef: ref }),
}));
