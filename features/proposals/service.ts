import {
    DocumentSnapshot,
    Timestamp,
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    startAfter,
    updateDoc,
    where
} from "firebase/firestore";

import { TProposal } from "@/entities/proposals";
import { TUser } from "@/entities/users";
import { db } from "@/lib/firebaseConfig";
import { storage } from "@/lib/firebaseStorageConfig";
import { RawProposalData, proposalToEntity } from "@/mappers/proposalToEntity";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const PAGE_SIZE = 5;

type ProposalFilters = {
    ordenar?: "Recientes" | "Más Antigüos";
};



export const fetchProposalsPage = async (
    filters: ProposalFilters,
    user: TUser,
    lastVisible?: DocumentSnapshot
): Promise<{ proposals: TProposal[]; last: DocumentSnapshot | null }> => {
    try {
        const proposalsRef = collection(db, "proposals");

        const constraints: any[] = [];

        // 🔐 Filtrar por referencia a client_id o provider_id
        const userRef = doc(db, "users", user.id);

        if (user.profileStatus === "client") {
            constraints.push(where("client_id", "==", userRef));
        } else if (user.profileStatus === "provider") {
            constraints.push(where("provider_id", "==", userRef));
        }

        // Orden por fecha
        if (filters.ordenar === "Más Antigüos") {
            constraints.push(orderBy("created_at", "asc"));
        } else {
            constraints.push(orderBy("created_at", "desc")); // default
        }

        // Paginación
        if (lastVisible) {
            constraints.push(startAfter(lastVisible));
        }

        constraints.push(limit(PAGE_SIZE));

        const q = query(proposalsRef, ...constraints);
        const snapshot = await getDocs(q);

        const proposalPromises = snapshot.docs.map((doc) =>
            proposalToEntity(doc.id, doc.data() as RawProposalData)
        );

        const proposals = await Promise.all(proposalPromises);
        const last = snapshot.docs[snapshot.docs.length - 1] ?? null;

        return { proposals, last };
    } catch (error) {
        console.error("🔥 Error al paginar proposals:", error);
        return { proposals: [], last: null };
    }
};


export const getProposalById = async (id: string): Promise<TProposal | null> => {
    try {
        const proposalRef = doc(db, "proposals", id);
        const proposalSnap = await getDoc(proposalRef);

        if (!proposalSnap.exists()) return null;

        const rawData = proposalSnap.data() as RawProposalData;
        const proposal = await proposalToEntity(proposalSnap.id, rawData);

        return proposal;
    } catch (error) {
        console.error("Error al obtener la propuesta:", error);
        return null;
    }
};


export const subscribeToProposalById = (
    id: string,
    callback: (proposal: TProposal | null) => void
): (() => void) => {
    const proposalRef = doc(db, "proposals", id);

    const unsubscribe = onSnapshot(proposalRef, async (docSnap) => {
        if (!docSnap.exists()) {
            callback(null);
            return;
        }

        const rawData = docSnap.data() as RawProposalData;
        const proposal = await proposalToEntity(docSnap.id, rawData);
        callback(proposal);
    });

    return unsubscribe;
};




export const createProposal = async (
    input: any
): Promise<string | null> => {
    try {
        const proposalsRef = collection(db, "proposals");
        const uploadedImages: string[] = [];

        for (const [index, uri] of input.referenceImages.entries()) {
            if (!uri || typeof uri !== "string") {
                console.warn(`URI inválida en imagen ${index}:`, uri);
                continue;
            }

            const response = await fetch(uri);
            const blob = await response.blob();

            const imageRef = ref(storage, `proposals/${Date.now()}_${index}.jpg`);
            await uploadBytes(imageRef, blob);
            const downloadURL = await getDownloadURL(imageRef);
            uploadedImages.push(downloadURL);
        }

        const formattedOffers = input.offers.map((offer: any) => ({
            ...offer,
            time: Timestamp.fromDate(offer.time),
        }));

        const newProposal = {
            client_id: doc(db, "users", input.clientId),
            provider_id: doc(db, "users", input.providerId),
            post_id: doc(db, "posts", input.postId),
            offers: formattedOffers,
            description: input.description,
            reference_image: uploadedImages,
            accept_status: 'pending',
            pay_method: input.payMethod,
            start_date: Timestamp.fromDate(input.startDate),
            created_at: Timestamp.fromDate(new Date()),
            address: {
                street_address: input.streetAddress,
                zipcode: input.zipCode,
                neighborhood: input.neighborhood,
                latitude: input.location.latitude,
                longitude: input.location.longitude,
            },
        };

        const docRef = await addDoc(proposalsRef, newProposal);
        return docRef.id;
    } catch (error) {
        console.error("❌ Error al crear la propuesta:", error);
        return null;
    }
};


export const rejectProposal = async (proposalId: string): Promise<boolean> => {
    try {
        const proposalRef = doc(db, "proposals", proposalId);

        await updateDoc(proposalRef, {
            accept_status: "rejected",
        });

        return true;
    } catch (error) {
        console.error("❌ Error al rechazar propuesta:", error);
        return false;
    }
};


export const acceptProposalAndCreateContract = async (
    proposalId: string,
    data: any
): Promise<boolean> => {
    try {
        const proposalRef = doc(db, "proposals", proposalId);

        await updateDoc(proposalRef, {
            accept_status: "accepted",
        });

        const contractsRef = collection(db, "contracts");

        const contractData = {
            client_id: doc(db, "users", data.client.id),
            provider_id: doc(db, "users", data.provider.id),
            post_id: doc(db, "posts", data.post.id),
            offers: data.offers,
            description: data.description,
            reference_image: data.referenceImages ?? [],
            pay_method: data.paymentMethod,
            start_date: data.startDate,
            created_at: Timestamp.now(),
            progress_status: "pending",
            address: {
                ...data.address,
                street_address: data.address.streetAddress,
                zipcode: data.address.zipcode,
                neighborhood: data.address.neighborhood,
                latitude: data.address.latitude,
                longitude: data.address.longitude,
            },
        };

        const contractDoc = await addDoc(contractsRef, contractData);

        // ✅ Si el pago es con tarjeta, crear el checkout_session
        if (data.paymentMethod === "card") {
            const sessionRef = collection(db, `customers/${data.client.id}/checkout_sessions`);
            const totalAmount = data.offers.reduce((acc: number, offer: any) => acc + Number(offer.price), 0);

            await addDoc(sessionRef, {
                client: "mobile",
                mode: "payment",
                amount: Math.round(totalAmount * 100), // en centavos
                currency: "mxn",
                success_url: "yourapp://payment-success",
                cancel_url: "yourapp://payment-cancel",
                metadata: {
                    contract_id: contractDoc.id,
                },
            });
        }

        return true;
    } catch (error) {
        console.error("Error al aceptar propuesta y crear contrato:", error);
        return false;
    }
};


export const addCounterOffer = async (
    proposalId: string,
    newOffer: {
        price: number;
        time: Date;
        isClient: boolean;
    },
    newStartDate: Date
): Promise<boolean> => {
    try {
        const proposalRef = doc(db, "proposals", proposalId);
        const proposalSnap = await getDoc(proposalRef);

        if (!proposalSnap.exists()) throw new Error("Propuesta no encontrada");

        const proposalData = proposalSnap.data();

        const updatedOffers = [...proposalData.offers];

        if (updatedOffers.length > 0) {
            // Desactivar la última oferta
            updatedOffers[updatedOffers.length - 1].active = false;
        }

        // Agregar la nueva oferta
        updatedOffers.push({
            ...newOffer,
            active: true,
            time: Timestamp.fromDate(newOffer.time),
        });

        await updateDoc(proposalRef, {
            offers: updatedOffers,
            start_date: Timestamp.fromDate(newStartDate),
        });

        return true;
    } catch (error) {
        console.error("❌ Error al agregar contraoferta y actualizar fecha:", error);
        return false;
    }
};

