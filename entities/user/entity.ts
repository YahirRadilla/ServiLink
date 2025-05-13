import { TProvider, emptyProvider } from "../providers/index";

export type TProfileStatus = 'client' | 'provider'

export type TUser = {
    id: string
    name: string
    lastname: string
    secondLastname: string
    address: {
        streetAddress : string
        zipCode: string
        neighborhood: string
    }
    phoneNumber: number
    email: string
    status: boolean
    profileStatus: TProfileStatus
    imageProfile: string
    birthDate: Date
    provider: TProvider
}


export const emptyUser: TUser = {
    id: '',
    name: '',
    lastname: '',
    secondLastname: '',
    address: {
        streetAddress : '',
        zipCode: '',
        neighborhood: '',
    },
    phoneNumber: 5,
    email: '',
    status: false,
    profileStatus: 'client',
    imageProfile: '',
    birthDate: new Date(),
    provider: emptyProvider
}
