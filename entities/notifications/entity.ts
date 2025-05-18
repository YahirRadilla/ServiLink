import { Timestamp } from 'firebase/firestore';
import { emptyUser, TUser, TUserType } from '../users/index';

export type TNotificationType = 'message' | 'contract' | 'proposal' | 'review' | 'other'
export type TGroupedNotification =
  | ({ type: 'header'; id: string; label: string })
  | (TNotification & { type: 'notification' });
 
export type TNotification = {
    id: string
    user: TUser
    userType: TUserType
    title: string
    content: string
    type: TNotificationType
    seen: boolean
    createdAt: Timestamp
}

export const emptyNotification: TNotification = {
    id: '',
    user: emptyUser,
    userType: 'client',
    title: '',
    content: '',
    type: 'other',
    seen: false,
    createdAt: Timestamp.now(),
}