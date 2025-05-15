import { TAddress } from "../../shared/interfaces/index";
import { TProvider, emptyProvider } from "../providers/index";

export type TUserType = "client" | "provider";

export type TUser = {
    id: string;
    name: string;
    lastname: string;
    secondLastname?: string;
    address?: TAddress | null;
    phoneNumber?: string | null;
    email: string | null;
    status: boolean;
    profileStatus: TUserType;
    imageProfile?: string;
    birthDate: Date | null;
    provider: TProvider;
};

export const emptyUser: TUser = {
    id: "",
    name: "",
    lastname: "",
    secondLastname: "",
    address: {
        streetAddress: "",
        zipCode: "",
        neighborhood: "",
    },
    phoneNumber: '',
    email: "",
    status: false,
    profileStatus: "client",
    imageProfile: "",
    birthDate: new Date(),
    provider: emptyProvider,
};
