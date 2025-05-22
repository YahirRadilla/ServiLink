import { TContract } from "@/entities/contracts";
import { getContractById } from "@/features/contracts/service";
import { useEffect, useState } from "react";

export const useContractById = (id?: string) => {
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
};
