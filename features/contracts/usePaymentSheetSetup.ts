import { db } from "@/lib/firebaseConfig";
import { initPaymentSheet } from "@stripe/stripe-react-native";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useState } from "react";

interface UsePaymentSheetSetupProps {
    contract: any;
    userId?: string;
    profileStatus?: "client" | "provider";
}

export const usePaymentSheetSetup = ({
    contract,
    userId,
    profileStatus,
}: UsePaymentSheetSetupProps) => {
    const [showPaymentButton, setShowPaymentButton] = useState(false);

    const initializePaymentSheet = async () => {
        if (
            !contract ||
            profileStatus !== "client" ||
            contract.paymentMethod !== "card" ||
            contract.progressStatus !== "pending" ||
            !userId
        ) {
            return;
        }

        try {
            // Verificar si ya se pagó
            const paymentsRef = collection(db, `customers/${userId}/payments`);
            const latestPaymentQuery = query(paymentsRef, orderBy("created", "desc"), limit(1));
            const paymentSnap = await getDocs(latestPaymentQuery);

            if (!paymentSnap.empty) {
                const paymentData = paymentSnap.docs[0].data();
                if (paymentData.status === "succeeded") return;
            }

            // Obtener checkout_session relacionado al contrato
            const sessionsRef = collection(db, `customers/${userId}/checkout_sessions`);
            const sessionQuery = query(sessionsRef, where("metadata.contract_id", "==", contract.id));
            const sessionSnap = await getDocs(sessionQuery);

            if (!sessionSnap.empty) {
                const session = sessionSnap.docs[0].data();
                const { paymentIntentClientSecret, ephemeralKeySecret, customer } = session;

                const initSheet = await initPaymentSheet({
                    customerEphemeralKeySecret: ephemeralKeySecret,
                    customerId: customer,
                    paymentIntentClientSecret,
                    merchantDisplayName: "ServiLink",
                    allowsDelayedPaymentMethods: false,
                });

                if (!initSheet.error) {
                    setShowPaymentButton(true);
                }
            }
        } catch (err) {
            console.error("Error inicializando PaymentSheet:", err);
        }
    };

    return {
        showPaymentButton,
        initializePaymentSheet,
    };
};
