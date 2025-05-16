import { create } from 'zustand';
import { TNotification } from "./entity";


type NotificationState = {
    notifications: TNotification[];
    addNotification: (notification: TNotification) => void;
    setNotifications: (notifications: TNotification[]) => void;
    clearNotifications: () => void;
    /* markAsSeen: (id: string) => void; */
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    addNotification: (notification: TNotification) => set({ notifications: [...get().notifications, notification] }),
    setNotifications: (notifications: TNotification[]) => set({ notifications }),
    clearNotifications: () => set({ notifications: [] }),
}))