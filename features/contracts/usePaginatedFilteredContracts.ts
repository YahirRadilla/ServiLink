import { useContractStore } from "@/entities/contracts/store";
import { TUser, useUserStore } from "@/entities/users";
import { useEffect, useState } from "react";
import { fetchContractsPage } from "./service";

type Filters = {
    ordenar?: string;
};

export const usePaginatedFilteredContracts = (filters: Filters) => {
    const {
        contracts,
        setContracts,
        appendContracts,
        applyFilters,
        resetFilters,
    } = useContractStore();

    const [lastDoc, setLastDoc] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const user = useUserStore((state) => state.user);

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        const { contracts: newContracts, last } = await fetchContractsPage(
            filters as any,
            user as TUser,
            lastDoc
        );

        appendContracts(newContracts);
        setLastDoc(last);
        setHasMore(!!last);
        setLoading(false);
        applyFilters(filters);
    };

    const refresh = async () => {
        setIsRefreshing(true);

        const { contracts: newContracts, last } = await fetchContractsPage(
            filters as any,
            user as TUser
        );

        setContracts(newContracts);
        setLastDoc(last);
        setHasMore(!!last);
        setIsRefreshing(false);
        applyFilters(filters);
    };

    useEffect(() => {
        refresh();
    }, [filters.ordenar]);

    return {
        contracts,
        loadMore,
        loading,
        hasMore,
        refresh,
        isRefreshing,
    };
};
