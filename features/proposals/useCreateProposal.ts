import { usePostStore } from "@/entities/posts";
import { useUserStore } from "@/entities/users";
import { useState } from "react";
import { createProposal } from "./service";




export const useCreateProposals = () => {
    const [loading, setLoading] = useState(false);
    const user = useUserStore((state) => state.user);
    const currentPost = usePostStore((state) => state.currentPost);

    const createNewProposal = async (proposalData: any) => {
        if (!user) {
            console.warn("⚠️ Usuario no autenticado");
            return null;
        }
        console.log({
            ...proposalData,
            clientId: user.id,
            postId: currentPost?.id!,
            providerId: currentPost?.provider.id!,
            payMethod: proposalData.payMethod as string === "Tarjeta" ? "card" : "effective",
        });
        setLoading(true);
        try {
            const proposalId = await createProposal({
                ...proposalData,
                clientId: user.id,
                postId: currentPost?.id!,
                providerId: currentPost?.provider.id!,
                payMethod: proposalData.payMethod as string === "Tarjeta" ? "card" : "effective",
            });

            return proposalId;
        } catch (error) {
            console.error("❌ Error al crear propuesta desde el hook:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        createNewProposal,
    };
};
