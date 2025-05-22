import { TContract } from "@/entities/contracts";
import { getPostByRef } from "@/entities/posts";
import { getUserByRef } from "@/entities/users";
import { Timestamp } from "firebase/firestore";

export type RawContractData = {
    client_id: any;
    provider_id: any;
    post_id: any;
    offers: {
        time: Timestamp;
        price: number;
        active: boolean;
        isClient: boolean
    }[];
    description: string;
    reference_image?: string[];
    progress_status: string;
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

export const contractToEntity = async (
    id: string,
    data: RawContractData
): Promise<TContract> => {
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
        progressStatus: data.progress_status,
        paymentMethod: data.pay_method,
        startDate: data.start_date,
        createdAt: data.created_at,
        address: {
            ...data.address,
            streetAddress: data.address.street_address,
        },
    };
};
