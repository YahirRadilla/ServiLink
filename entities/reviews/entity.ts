import { emptyPost, TPost } from '../posts'
import { emptyUser, TUser } from '../users/index'

export type TReview = {
    id: string
    client: TUser
    postId: TPost
    valoration: number
    textContent?: string
    images?: [string]
}

export const emptyReview: TReview = {
    id: '',
    client: emptyUser,
    postId: emptyPost,
    valoration: 0,
    textContent: '',
    images: [''],
}