import { TProposal } from '@/entities/proposals/entity';
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import { RawProposalData, proposalToEntity } from "@/mappers/proposalToEntity";
import {
    DocumentSnapshot,
    limit,
    orderBy,
    query,
    startAfter,
    where
} from "firebase/firestore";

const PAGE_SIZE = 5;

type ProposalFilters = {
    colonia?: string;
    ordenar?: "Recientes" | "Más Antigüos";
};

export const fetchProposalsPage = async (
    filters: ProposalFilters,
    lastVisible?: DocumentSnapshot
): Promise<{ proposals: TProposal[]; last: DocumentSnapshot | null }> => {
    try {
        const proposalsRef = collection(db, "proposals");

        let constraints: any[] = [];

        // Filtro por colonia
        if (filters.colonia) {
            constraints.push(where("address.neighborhood", "==", filters.colonia));
        }

        // Orden por fecha
        if (filters.ordenar === "Más Antigüos") {
            constraints.push(orderBy("created_at", "asc"));
        } else {
            constraints.push(orderBy("created_at", "desc")); // default
        }

        // Paginación
        if (lastVisible) {
            constraints.push(startAfter(lastVisible));
        }

        constraints.push(limit(PAGE_SIZE));

        const q = query(proposalsRef, ...constraints);
        const snapshot = await getDocs(q);

        const proposalPromises = snapshot.docs.map((doc) =>
            proposalToEntity(doc.id, doc.data() as RawProposalData)
        );

        const proposals = await Promise.all(proposalPromises);
        const last = snapshot.docs[snapshot.docs.length - 1] ?? null;

        return { proposals, last };
    } catch (error) {
        console.error("🔥 Error al paginar proposals:", error);
        return { proposals: [], last: null };
    }
};


export const fetchProposals = async (): Promise<TProposal[]> => {
    const proposalsRef = collection(db, "proposals");
    const proposalsSnap = await getDocs(proposalsRef);
    const proposals: TProposal[] = [];

    proposalsSnap.forEach((doc) => {
        proposals.push({
            ...(doc.data() as TProposal),
            id: doc.id,
        });
    });
    return proposals;
};

