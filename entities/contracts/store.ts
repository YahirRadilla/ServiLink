import { create } from 'zustand';
import { TContract } from './entity';

type ContractState = {
    contracts: TContract[];
    filteredContracts: TContract[];
    filters: Record<string, string>;
    setContracts: (contracts: TContract[]) => void;
    setFilters: (filters: Record<string, string>) => void;
    applyFilters: (filters: any) => void;
    clearContracts: () => void;
    resetFilters: () => void;
    appendContracts: (newContracts: TContract[]) => void;
};

export const useContractStore = create<ContractState>((set, get) => ({
    contracts: [],
    filteredContracts: [],
    filters: {},

    setContracts: (contracts) => set({ contracts }, false),

    clearContracts: () => set({ contracts: [] }),

    setFilters: (filters) => set({ filters }, false),

    applyFilters: (filters: any) => {
        const contracts = get().contracts;

        let filtered = contracts.filter((contract) => {
            const matchesFilters = Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                if (key === "colonia") return contract.address.neighborhood === value;
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

        set({ filteredContracts: filtered, filters });
    },

    resetFilters: () =>
        set({
            filters: {
                colonia: "",
                orden: "",
            },
            filteredContracts: get().contracts,
        }),

    appendContracts: (newContracts) =>
        set((state) => ({
            contracts: [
                ...state.contracts,
                ...newContracts.filter(
                    (c) => !state.contracts.some((existing) => existing.id === c.id)
                ),
            ],
        })),
}));
