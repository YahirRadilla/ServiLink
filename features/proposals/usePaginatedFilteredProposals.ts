import { TProposal } from "@/entities/proposals";
import { useProposalStore } from "@/entities/proposals/store";
import { TUser, useUserStore } from "@/entities/users";
import { db } from "@/lib/firebaseConfig";
import { proposalToEntity, RawProposalData } from "@/mappers/proposalToEntity";
import { collection, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { fetchProposalsPage } from "./service";

type Filters = {
    ordenar?: string;
    status?: string;
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

    // --- NUEVO: Listener en tiempo real ---
    useEffect(() => {
        if (!user) return;

        const userRef = doc(db, "users", user.id);
        let q;

        if (user.profileStatus === "client") {
            q = query(
                collection(db, "proposals"),
                where("client_id", "==", userRef),
                orderBy("created_at", "desc")
            );
        } else if (user.profileStatus === "provider") {
            q = query(
                collection(db, "proposals"),
                where("provider_id", "==", userRef),
                orderBy("created_at", "desc")
            );
        } else {
            return;
        }

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const proposalPromises = snapshot.docs.map((doc) =>
                proposalToEntity(doc.id, doc.data() as RawProposalData)
            );
            const proposals = await Promise.all(proposalPromises);
            setProposals(proposals);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] ?? null);
            setHasMore(!!snapshot.docs.length);
        });

        return () => unsubscribe();
    // Solo depende de user
    }, [user]);

    const filteredProposals = useMemo(() => {
        return proposals.filter((proposal: TProposal) => {
            if (filters.status && filters.status !== "all") {
                return proposal.acceptStatus === filters.status;
            }
            return true;
        });
    }, [ proposals, filters.status]);

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
        const unique = newProposals.filter(
            (proposal, index, self) =>
                self.findIndex((p) => p.id === proposal.id) === index
        );

        setProposals(unique);
        setLastDoc(last);
        setHasMore(!!last);
        setIsRefreshing(false);
        applyFilters(filters);
    };

    useEffect(() => {
        refresh();
    }, [filters.ordenar, filters.status]);

    return {
        proposals: filteredProposals,
        loadMore,
        loading,
        hasMore,
        refresh,
        isRefreshing,
    };
};
