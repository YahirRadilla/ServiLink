import { TContract } from '@/entities/contracts/entity';
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const fetchContracts = async (): Promise<TContract[]> => {
    const contractsRef = collection(db, "contracts");
    const contractsSnap = await getDocs(contractsRef);
    const contracts: TContract[] = [];

    contractsSnap.forEach((doc) => {
        contracts.push({
            ...(doc.data() as TContract),
            id: doc.id,
        });
    });
    return contracts;
};

