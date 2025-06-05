import { emptyProvider } from "@/entities/providers";
import { TUser } from "@/entities/users";
import { Timestamp } from "firebase/firestore";

export const mapFirestoreUserToTUser = (doc: any): TUser => {
    return {
        id: doc.id,
        name: doc.name,
        lastname: doc.lastname,
        secondLastname: doc.second_lastname || "",
        address: doc.address || undefined,
        phoneNumber: doc.phone_number || undefined,
        email: doc.email,
        status: doc.status,
        profileStatus: doc.profile_status,
        imageProfile: doc.image_profile || "",
        birthDate: doc.birth_date instanceof Timestamp
            ? doc.birth_date.toDate()
            : typeof doc.birth_date === "string"
                ? new Date(doc.birth_date)
                : undefined,
        provider:
            doc.provider
                ? {
                    id: doc.provider_id?.id ?? "",
                    rfc: doc.provider.rfc,
                    servicesOffered: doc.provider.servicesOffered,
                    status: doc.provider.status,
                }
                : emptyProvider,
    };
};
