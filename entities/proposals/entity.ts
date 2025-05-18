import { TAddress } from '@/shared/interfaces'
import { Timestamp } from 'firebase/firestore'
import { TPost } from '../posts/index'
import { TUser } from '../users/index'

export type TPaymentMethod = 'effective' | 'card'

export type TProposal = {
    id: string
    client: TUser
    provider: TUser
    post: TPost
    priceOffer: number
    description: string
    referenceImages?: string[]
    acceptStatus: string
    paymentMethod: TPaymentMethod
    startDate: Timestamp
    createdAt: Timestamp
    address: TAddress
}

export type TDraftProposal = {
    client: TUser
    provider: TUser
    post: TPost
    priceOffer: number
    description: string
    referenceImages?: string[]
    acceptStatus: string
    paymentMethod: TPaymentMethod
    startDate: Timestamp
    createdAt: Timestamp
    address: TAddress
}
