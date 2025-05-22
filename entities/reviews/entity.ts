import { Timestamp } from 'firebase/firestore'
import { emptyPost, TPost } from '../posts'
import { emptyUser, TUser } from '../users/index'

export type TReview = {
    id: string
    client: TUser
    post: TPost
    valoration: number
    textContent?: string
    images?: [string]
    createdAt: Timestamp
}

export const emptyReview: TReview = {
    id: '',
    client: emptyUser,
    post: emptyPost,
    valoration: 0,
    textContent: '',
    images: [''],
    createdAt: Timestamp.now(),
}