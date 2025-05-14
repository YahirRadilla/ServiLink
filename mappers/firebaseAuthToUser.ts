import { TUser } from "@/entities/users";

export const mapFirestoreUserToTUser = (doc: any): TUser => {
    return {
        id: doc.id,
        name: doc.name,
        lastname: doc.lastname,
        secondLastname: doc.secondLastname || "",
        address: doc.address || undefined,
        phoneNumber: doc.phoneNumber || undefined,
        email: doc.email,
        status: doc.status,
        profileStatus: doc.profileStatus,
        imageProfile: doc.imageProfile || "",
        birthDate: new Date(doc.birthDate),
        provider: doc.provider,
    };
};
