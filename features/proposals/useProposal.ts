import { useProposalStore } from "@/entities/proposals/store";
import { useState } from "react";
import { fetchProposals } from "./service";


export const useProposal = () => {
    const { setProposals, clearProposals } = useProposalStore();
    const [loading, setLoading] = useState(false);

    const loadProposals = async () => {
        setLoading(true);
        try {
            const proposals = await fetchProposals();
            setProposals(proposals);
        } catch (error) {
            console.error("Error:", error);
            clearProposals();
        } finally {
            setLoading(false);
        }
    };

    return {
        loadProposals,
        loading,
        clearProposals,

    };
}