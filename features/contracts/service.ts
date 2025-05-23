import { TContract } from "@/entities/contracts";
import { TUser } from "@/entities/users";
import { db } from "@/lib/firebaseConfig";
import { RawContractData, contractToEntity } from "@/mappers/contractToEntity";
import {
    DocumentSnapshot,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    where,
} from "firebase/firestore";

const PAGE_SIZE = 5;

type ContractFilters = {
    ordenar?: "Recientes" | "Más Antigüos";
};

export const fetchContractsPage = async (
    filters: ContractFilters,
    user: TUser,
    lastVisible?: DocumentSnapshot
): Promise<{ contracts: TContract[]; last: DocumentSnapshot | null }> => {
    try {
        const contractsRef = collection(db, "contracts");
        const constraints: any[] = [];

        const userRef = doc(db, "users", user.id);

        if (user.profileStatus === "client") {
            constraints.push(where("client_id", "==", userRef));
        } else if (user.profileStatus === "provider") {
            constraints.push(where("provider_id", "==", userRef));
        }


        if (filters.ordenar === "Más Antigüos") {
            constraints.push(orderBy("created_at", "asc"));
        } else {
            constraints.push(orderBy("created_at", "desc"));
        }

        if (lastVisible) {
            constraints.push(startAfter(lastVisible));
        }

        constraints.push(limit(PAGE_SIZE));

        const q = query(contractsRef, ...constraints);
        const snapshot = await getDocs(q);

        const contractPromises = snapshot.docs.map((doc) =>
            contractToEntity(doc.id, doc.data() as RawContractData)
        );

        const contracts = await Promise.all(contractPromises);
        const last = snapshot.docs[snapshot.docs.length - 1] ?? null;

        return { contracts, last };
    } catch (error) {
        console.error("🔥 Error al paginar contratos:", error);
        return { contracts: [], last: null };
    }
};


export const getContractById = async (id: string): Promise<TContract | null> => {
    try {
        const contractRef = doc(db, "contracts", id);
        const contractSnap = await getDoc(contractRef);

        if (!contractSnap.exists()) return null;

        const rawData = contractSnap.data() as RawContractData;
        const contract = await contractToEntity(contractSnap.id, rawData);

        return contract;
    } catch (error) {
        console.error("Error al obtener el contrato:", error);
        return null;
    }
};

export const getContractsByPostId = async (postId: string): Promise<TContract[]> => {
  const postRef = doc(db, "posts", postId);

  const q = query(collection(db, "contracts"), where("post_id", "==", postRef));
  const snapshot = await getDocs(q);

  const contracts = await Promise.all(
    snapshot.docs.map((docSnap) =>
      contractToEntity(docSnap.id, docSnap.data() as RawContractData)
    )
  );

  return contracts;
};