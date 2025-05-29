import { TContract } from "@/entities/contracts";
import { useContractStore } from "@/entities/contracts/store";
import { TUser, useUserStore } from "@/entities/users";
import { db } from "@/lib/firebaseConfig";
import { contractToEntity, RawContractData } from "@/mappers/contractToEntity";
import { collection, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { fetchContractsPage } from "./service";

type Filters = {
    ordenar?: string;
    status?: string;
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

    useEffect(() => {
        if (!user) return;

        const userRef = doc(db, "users", user.id);
        let q;

        if (user.profileStatus === "client") {
            q = query(
                collection(db, "contracts"),
                where("client_id", "==", userRef),
                orderBy("created_at", "desc")
            );
        } else if (user.profileStatus === "provider") {
            q = query(
                collection(db, "contracts"),
                where("provider_id", "==", userRef),
                orderBy("created_at", "desc")
            );
        } else {
            return;
        }

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const contractPromises = snapshot.docs.map((doc) =>
                contractToEntity(doc.id, doc.data() as RawContractData)
            );
            const contracts = await Promise.all(contractPromises);
            setContracts(contracts);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] ?? null);
            setHasMore(!!snapshot.docs.length);
        });

        return () => unsubscribe();
    }, [user]);

    const filteredContracts = useMemo(() => {
        return contracts.filter((contracts: TContract) => {
            if (filters.status && filters.status !== "all") {
                return contracts.progressStatus === filters.status;
            }
            return true;
        })
    }, [ contracts, filters.status]);

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

        const { contracts: newContracts, last } = await fetchContractsPage(filters as any,user as TUser);
        const unique = newContracts.filter(
            (contract, index, self) =>
                self.findIndex((c) => c.id === contract.id) === index
        );

        setContracts(unique);
        setLastDoc(last);
        setHasMore(!!last);
        setIsRefreshing(false);
        applyFilters(filters);
    };

/*     useEffect(() => {
        refresh();
    }, [filters.ordenar, filters.status]); */

    return {
        contracts: filteredContracts,
        loadMore,
        loading,
        hasMore,
        refresh,
        isRefreshing,
    };
};
