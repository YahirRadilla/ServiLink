import { TProposal } from "@/entities/proposals";
import { useEffect, useState } from "react";
import { getProposalById } from "./service";



export const useProposalById = (proposalId: string | null) => {
    const [proposal, setProposal] = useState<TProposal | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProposal = async () => {
            if (!proposalId) return;

            setLoading(true);
            setError(null);

            try {
                const data = await getProposalById(proposalId);
                setProposal(data);
            } catch (err: any) {
                console.error("Error al cargar la propuesta:", err);
                setError("No se pudo cargar la propuesta.");
            } finally {
                setLoading(false);
            }
        };

        fetchProposal();
    }, [proposalId]);




    return { proposal, loading, error };
}