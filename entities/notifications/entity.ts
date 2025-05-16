import { emptyUser, TUser, TUserType } from '../users/index'

export type TNotificationType = 'message' | 'contract' | 'proposal' | 'review' | 'other'
 
export type TNotification = {
    id: string
    user: TUser
    userType: TUserType
    title: string
    content: string
    type: TNotificationType
    seen: boolean
    date: string
}

export const emptyNotification: TNotification = {
    id: '',
    user: emptyUser,
    userType: 'client',
    title: '',
    content: '',
    type: 'other',
    seen: false,
    date: ''
}