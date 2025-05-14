import { create } from 'zustand';
import { TContract } from './entity';

type ContractState = {
    contracts: TContract[];
    setContracts: (contracts: TContract[]) => void;
    clearContracts: () => void;
}

export const useContractStore = create<ContractState>((set) => ({
    contracts: [],
    setContracts: (contracts) => set({ contracts }),
    clearContracts: () => set({ contracts: [] }),
}))