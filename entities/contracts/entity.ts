import { emptyProposal, TProposal } from '../proposals/index'
import { emptyProvider, TProvider } from '../providers/index'
import { emptyUser, TUser } from '../users/index'

export type TContractStatus = 'pending' | 'active' | 'finished' |'canceled'

export type TContract = {
    id: string
    client: TUser
    provider: TProvider
    proposal: TProposal
    status: TContractStatus
}

export const emptyContract: TContract = {
    id: '',
    client: emptyUser,
    provider: emptyProvider,
    proposal: emptyProposal,
    status: 'pending',    
}

