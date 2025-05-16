import { Timestamp } from "firebase/firestore";
import { TAddress } from "../../shared/interfaces/index";
import { TProvider } from "../providers/index";
import { emptyUser, TUser } from "../users";

export type TTypePost = 'custom' | 'fixed';

export type TPost = {
    id: string
    title: string
    description: string
    valoration: number
    images: string[]
    postType: TTypePost
    status: boolean
    minPrice: number
    maxPrice: number
    provider: TUser
    address: TAddress
    service: string
    createdAt: Timestamp
}

export type TDraftPost = {
    title: string
    description: string
    valoration: number
    images: [string]
    postType: TTypePost
    status: boolean
    minPrice: number
    maxPrice: number
    provider: TProvider
    address: TAddress
    service: string
}

export const emptyPost: TPost = {
    id: '',
    title: '',
    description: '',
    valoration: 0,
    images: [''],
    postType: 'custom',
    status: false,
    minPrice: 0,
    maxPrice: 0,
    provider: emptyUser,
    address: {
        streetAddress: '',
        zipCode: '',
        neighborhood: '',
    },
    service: '',
    createdAt: Timestamp.fromDate(new Date()),
}

