import { getPostByRef } from "@/entities/posts";
import { TProposal } from "@/entities/proposals";
import { getUserByRef } from "@/entities/users";
import { Timestamp } from "firebase/firestore";

export type RawProposalData = {
    client_id: any;
    provider_id: any;
    post_id: any;
    offers: {
        time: Timestamp;
        price: number;
        active: boolean;
    }[];
    description: string;
    reference_image?: string[];
    accept_status: string;
    pay_method: "card" | "effective";
    start_date: Timestamp;
    created_at: Timestamp;
    address: {
        street_address: string
        zipCode: string
        neighborhood: string
        latitude?: number | null | undefined
        longitude?: number | null | undefined
    };
};

export const proposalToEntity = async (
    id: string,
    data: RawProposalData
): Promise<TProposal> => {
    const [client, provider, post] = await Promise.all([
        getUserByRef(data.client_id),
        getUserByRef(data.provider_id),
        getPostByRef(data.post_id),
    ]);

    return {
        id,
        client,
        provider,
        post,
        offers: data.offers,
        description: data.description,
        referenceImages: data.reference_image ?? [],
        acceptStatus: data.accept_status,
        paymentMethod: data.pay_method,
        startDate: data.start_date,
        createdAt: data.created_at,
        address: {
            ...data.address,
            streetAddress: data.address.street_address,
        },
    };
};
