import { create } from 'zustand';
import { TProposal } from './entity';

type ProposalState = {
    proposals: TProposal[];
    setProposals: (proposals: TProposal[]) => void;
    clearProposals: () => void;
}

export const useProposalStore = create<ProposalState>((set) => ({
    proposals: [],
    setProposals: (proposals) => set({ proposals }),
    clearProposals: () => set({ proposals: [] }),
}))