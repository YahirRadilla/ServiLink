import { TProvider, emptyProvider } from '../providers/index'
import { TUser, emptyUser } from '../users/index'

export type TConversation = {
    id: string
    client: TUser
    provider: TProvider
    lastMessage: string
    date: Date
}

export const emptyConversation: TConversation = {
    id: '',
    client: emptyUser,
    provider: emptyProvider,
    lastMessage: '',
    date: new Date(),
}