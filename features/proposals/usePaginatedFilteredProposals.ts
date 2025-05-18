import { TProposal } from "@/entities/proposals";
import { useEffect, useState } from "react";
import { fetchProposalsPage } from "./service";

type Filters = {
    colonia?: string;
    ordenar?: string;
    searchTerm?: string;
};

export const usePaginatedFilteredProposals = (filters: Filters) => {
    const [proposals, setProposals] = useState<TProposal[]>([]);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const search = filters.searchTerm?.toLowerCase();

    const filteredProposals = !search
        ? proposals
        : proposals.filter((proposal) => {
            return (
                proposal.description.toLowerCase().includes(search) ||
                proposal.client.name.toLowerCase().includes(search) ||
                proposal.provider.name.toLowerCase().includes(search)
            );
        });

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        const { proposals: newProposals, last } = await fetchProposalsPage(filters as any, lastDoc);

        setProposals((prev) => {
            const all = [...prev, ...newProposals];
            const unique = all.filter(
                (proposal, index, self) =>
                    self.findIndex((p) => p.id === proposal.id) === index
            );
            return unique;
        });

        setLastDoc(last);
        setHasMore(!!last);
        setLoading(false);
    };

    const refresh = async () => {
        setIsRefreshing(true);
        const { proposals: newProposals, last } = await fetchProposalsPage(filters as any);

        const unique = newProposals.filter(
            (proposal, index, self) =>
                self.findIndex((p) => p.id === proposal.id) === index
        );

        setProposals(unique);
        setLastDoc(last);
        setHasMore(!!last);
        setIsRefreshing(false);
    };

    useEffect(() => {
        refresh();
    }, [filters.colonia, filters.ordenar]);

    return {
        proposals: filteredProposals,
        loadMore,
        loading,
        hasMore,
        refresh,
        isRefreshing,
    };
};
