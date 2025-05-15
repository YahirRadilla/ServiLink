import { TProposal } from '@/entities/proposals/entity';
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

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

