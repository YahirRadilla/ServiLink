import { TUser, emptyUser } from '../users/index'

export type TReview = {
    id: string
    client: TUser
    valoration: number
    textContent?: string
    images?: [string]
}

export const emptyReview: TReview = {
    id: '',
    client: emptyUser,
    valoration: 0,
    textContent: '',
    images: [''],
}