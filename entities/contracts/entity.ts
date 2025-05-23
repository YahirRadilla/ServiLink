import { TAddress } from '@/shared/interfaces'
import { Timestamp } from 'firebase/firestore'
import { TPost } from '../posts'
import { TPaymentMethod } from '../proposals'
import { TUser } from '../users/index'

export type TContractStatus = 'pending' | 'active' | 'finished' | 'canceled'


export type TContract = {
    id: string
    client: TUser
    provider: TUser
    post: TPost
    offers: {
        time: Timestamp;
        price: number;
        active: boolean;
        isClient: boolean
    }[];
    description: string
    referenceImages?: string[]
    progressStatus: string
    paymentMethod: TPaymentMethod
    startDate: Timestamp
    createdAt: Timestamp
    address: TAddress
}

export type TDraftContract = {
    client: TUser
    provider: TUser
    post: TPost
    offers: {
        time: Timestamp;
        price: number;
        active: boolean;
        isClient: boolean
    }[];
    description: string
    referenceImages?: string[]
    progressStatus: string
    paymentMethod: TPaymentMethod
    startDate: Timestamp
    createdAt: Timestamp
    address: TAddress
}


