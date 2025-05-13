import { TService, emptyService } from "../services/index";



export type TProvider = {
    id: string
    rfc: string
    servicesOffered: [TService]
    status: boolean
}

export const emptyProvider: TProvider = {
    id: '',
    rfc: '',
    servicesOffered: [emptyService],
    status: false
}