import { useProposalStore } from "@/entities/proposals/store";
import { TUser, useUserStore } from "@/entities/users";
import { useEffect, useState } from "react";
import { fetchProposalsPage } from "./service";

type Filters = {
    colonia?: string;
    ordenar?: string;
};

export const usePaginatedFilteredProposals = (filters: Filters) => {
    const {
        proposals,
        setProposals,
        appendProposals,
        applyFilters,
        resetFilters,
    } = useProposalStore();

    const [lastDoc, setLastDoc] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const user = useUserStore((state) => state.user);

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        const { proposals: newProposals, last } = await fetchProposalsPage(filters as any, user as TUser, lastDoc);

        appendProposals(newProposals);
        setLastDoc(last);
        setHasMore(!!last);
        setLoading(false);
        applyFilters(filters);
    };

    const refresh = async () => {
        setIsRefreshing(true);

        const { proposals: newProposals, last } = await fetchProposalsPage(filters as any, user as TUser);

        setProposals(newProposals);
        setLastDoc(last);
        setHasMore(!!last);
        setIsRefreshing(false);
        applyFilters(filters);
    };

    useEffect(() => {
        refresh();
    }, [filters.colonia, filters.ordenar]);

    return {
        proposals,
        loadMore,
        loading,
        hasMore,
        refresh,
        isRefreshing,
    };
};
