import { useContractStore } from "@/entities/contracts/store";
import { useState } from "react";
import { fetchContracts } from "./service";


export const useContract = () => {
    const { setContracts, clearContracts } = useContractStore();
    const [loading, setLoading] = useState(false);

    const loadContracts = async () => {
        setLoading(true);
        try {
            const contracts = await fetchContracts();
            setContracts(contracts);
        } catch (error) {
            console.error("Error:", error);
            clearContracts();
        } finally {
            setLoading(false);
        }
    };

    return {
        loadContracts,
        loading,
        clearContracts,

    };
}