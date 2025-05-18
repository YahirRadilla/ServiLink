import { TUser } from "@/entities/users";

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
        birthDate: doc.birth_date,
        provider: doc.provider,
    };
};
