import { TPost } from "@/entities/posts";
import { db } from "@/lib/firebaseConfig";
import { collection, getDoc, getDocs, query, Timestamp, where } from "firebase/firestore";

export type RawPostData = {
    title: string;
    description: string;
    valoration: number;
    images: string[];
    post_type: TPost["postType"];
    status: boolean;
    min_price: number;
    max_price: number;
    provider_id: any;
    address: {
        neighborhood: string;
        street_address: string;
        zipcode: string;
    };
    service: string;
    created_at: Timestamp;
};

export async function postToEntity(id: string, data: RawPostData): Promise<TPost> {
    const providerSnap = await getDoc(data.provider_id);
    if (!providerSnap.exists()) throw new Error("Proveedor no encontrado");
    const usersRef = collection(db, "users");
    const qUser = query(usersRef, where("provider_id", "==", data.provider_id));
    const userSnap = await getDocs(qUser);

    const providerData = providerSnap.data() as any;

    const userData = {
        id: userSnap.docs[0].id,
        name: userSnap.docs[0].data().name,
        lastName: userSnap.docs[0].data().lastname,
        secondLastName: userSnap.docs[0].data().second_lastname,
        phoneNumber: userSnap.docs[0].data().phone_number,
        address: userSnap.docs[0].data().address,
        email: userSnap.docs[0].data().email,
        profileStatus: userSnap.docs[0].data().profile_status,
        imageProfile: userSnap.docs[0].data().image_profile,
        birthDate: userSnap.docs[0].data().birth_date,
        provider_id: providerSnap.id,
        rfc: providerData.rfc,
        servicesOffered: providerData.services_offered,
        status: providerData.status,
    }


    return {
        id,
        title: data.title,
        description: data.description,
        valoration: data.valoration,
        images: data.images,
        postType: data.post_type,
        status: data.status,
        minPrice: data.min_price,
        maxPrice: data.max_price,
        provider: userData as any,
        address: {
            streetAddress: data.address.street_address,
            zipCode: data.address.zipcode,
            neighborhood: data.address.neighborhood,
        },
        service: data.service,
        createdAt: data.created_at,
    };
}
