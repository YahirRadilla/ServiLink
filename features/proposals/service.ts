import {
    DocumentSnapshot,
    collection,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    where
} from "firebase/firestore";

import { TProposal } from "@/entities/proposals";
import { TUser } from "@/entities/users";
import { db } from "@/lib/firebaseConfig";
import { RawProposalData, proposalToEntity } from "@/mappers/proposalToEntity";

const PAGE_SIZE = 5;

type ProposalFilters = {
    colonia?: string;
    ordenar?: "Recientes" | "Más Antigüos";
};

export const fetchProposalsPage = async (
    filters: ProposalFilters,
    user: TUser,
    lastVisible?: DocumentSnapshot
): Promise<{ proposals: TProposal[]; last: DocumentSnapshot | null }> => {
    try {
        const proposalsRef = collection(db, "proposals");

        const constraints: any[] = [];

        // 🔐 Filtrar por referencia a client_id o provider_id
        const userRef = doc(db, "users", user.id);

        if (user.profileStatus === "client") {
            constraints.push(where("client_id", "==", userRef));
        } else if (user.profileStatus === "provider") {
            constraints.push(where("provider_id", "==", userRef));
        }

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
