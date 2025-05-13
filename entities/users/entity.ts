import { TAddress } from "../../shared/interfaces/index";
import { TProvider, emptyProvider } from "../providers/index";

export type TUserType = 'client' | 'provider'

export type TUser = {
    id: string
    name: string
    lastname: string
    secondLastname?: string
    address?: TAddress
    phoneNumber?: number
    email: string
    status: boolean
    profileStatus: TUserType
    imageProfile?: string
    birthDate: Date
    provider: TProvider
}


export const emptyUser: TUser = {
    id: '',
    name: 'yahir',
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
