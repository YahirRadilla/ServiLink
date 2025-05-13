import { TPost, emptyPost } from '../posts/index'
import { TProvider, emptyProvider } from '../providers/index'
import { TUser, emptyUser } from '../users/index'

export type TPaymentMethod = 'effective' | 'card'

export type TProposal = {
    id: string
    client: TUser
    provider: TProvider
    post: TPost
    priceOffer: number
    description: string
    referenceImages?: [string]
    acceptStatus: boolean
    paymentMethod: TPaymentMethod
    startDate: Date
}

export const emptyProposal: TProposal = {
    id: '',
    client: emptyUser,
    provider: emptyProvider,
    post: emptyPost,
    priceOffer: 0,
    description: '',
    referenceImages: [''],
    acceptStatus: false,
    paymentMethod: 'effective',
    startDate: new Date(),
}