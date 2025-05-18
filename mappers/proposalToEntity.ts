import { getPostByRef } from "@/entities/posts";
import { TProposal } from "@/entities/proposals";
import { getUserByRef } from "@/entities/users";
import { TAddress } from "@/shared/interfaces";
import { Timestamp } from "firebase/firestore";

export type RawProposalData = {
    client_id: any;
    provider_id: any;
    post_id: any;
    price_offer: number;
    description: string;
    reference_image?: string[];
    accept_status: string;
    pay_method: "card" | "effective";
    start_date: Timestamp;
    created_at: Timestamp;
    address: TAddress;
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
        priceOffer: data.price_offer,
        description: data.description,
        referenceImages: data.reference_image ?? [],
        acceptStatus: data.accept_status,
        paymentMethod: data.pay_method,
        startDate: data.start_date,
        createdAt: data.created_at,
        address: data.address,
    };
};
