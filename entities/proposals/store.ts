import { create } from 'zustand';
import { TProposal } from './entity';

type ProposalState = {
    proposals: TProposal[];
    filteredProposals: TProposal[];
    filters: Record<string, string>;
    setProposals: (proposals: TProposal[]) => void;
    setFilters: (filters: Record<string, string>) => void;
    applyFilters: (filters: any) => void;
    clearProposals: () => void;
    resetFilters: () => void;
    appendProposals: (newProposals: TProposal[]) => void;

}

export const useProposalStore = create<ProposalState>((set, get) => ({
    proposals: [],
    filteredProposals: [],
    filters: {},
    setProposals: (proposals) => set({ proposals }, false),
    clearProposals: () => set({ proposals: [] }),


    setFilters: (filters) => set({ filters }, false),
    applyFilters: (filters: any) => {
        const proposals = get().proposals;

        let filtered = proposals.filter((proposal) => {
            const matchesFilters = Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                if (key === "colonia") return proposal.address.neighborhood === value;
                return true;
            });

            return matchesFilters;
        });

        const order = filters.orden;
        if (order === "Recientes") {
            filtered.sort(
                (a, b) =>
                    (b.createdAt.toDate?.() ?? b.createdAt).getTime() -
                    (a.createdAt.toDate?.() ?? a.createdAt).getTime()
            );
        } else if (order === "Más Antigüos") {
            filtered.sort(
                (a, b) =>
                    (a.createdAt.toDate?.() ?? a.createdAt).getTime() -
                    (b.createdAt.toDate?.() ?? b.createdAt).getTime()
            );
        }

        set({ filteredProposals: filtered, filters });
    },
    resetFilters: () => set({
        filters: {
            colonia: "",
            orden: "",
        },
        filteredProposals: get().proposals,
    }),

    appendProposals: (newProposals) =>
        set((state) => ({
            proposals: [
                ...state.proposals,
                ...newProposals.filter(
                    (p) => !state.proposals.some((existing) => existing.id === p.id)
                ),
            ],
        })),

}))