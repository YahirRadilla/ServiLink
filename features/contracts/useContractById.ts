import { TContract } from "@/entities/contracts";
import { getContractsByPostId, subscribeToContractById } from "@/features/contracts/service";
import { useEffect, useState } from "react";

/* export const useContractById = (id?: string) => {
    const [contract, setContract] = useState<TContract | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchContract = async () => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const result = await getContractById(id);
            setContract(result);
        } catch (err) {
            console.error("Error al cargar el contrato:", err);
            setError("No se pudo cargar el contrato.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContract();
    }, [id]);

    return {
        contract,
        loading,
        error,
        refetch: fetchContract,
    };
}; */

export const useContractById = (id?: string) => {
    const [contract, setContract] = useState<TContract | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        setError(null);

        const unsubscribe = subscribeToContractById(
            id,
            (newContract) => {
                setContract(newContract);
                setLoading(false);
            },
            (err) => {
                setError("No se pudo cargar el contrato.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [id]);

    return {
        contract,
        loading,
        error,
        refetch: () => { },
    };
};



export const useContractsByPostId = (postId: string) => {
    const [contracts, setContracts] = useState<TContract[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!postId) return;

        setLoading(true);
        getContractsByPostId(postId)
            .then(setContracts)
            .finally(() => setLoading(false));
    }, [postId]);

    return { contracts, loading };
};