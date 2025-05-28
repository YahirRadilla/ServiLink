import { db } from "@/lib/firebaseConfig";
import { initPaymentSheet } from "@stripe/stripe-react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
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
    const [loadingIsPayment, setLoadingIsPayment] = useState(false);
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
            setLoadingIsPayment(true);
            // Verificar si ya se pagó
            const paymentsRef = collection(db, `customers/${userId}/payments`);
            const contractPaymentQuery = query(
                paymentsRef,
                where("metadata.contract_id", "==", contract.id),
                where("status", "==", "succeeded")
            );
            const paymentSnap = await getDocs(contractPaymentQuery);
            if (!paymentSnap.empty) {
                setLoadingIsPayment(false);
                return; // ya se pagó este contrato específico
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
            setLoadingIsPayment(false);
        } catch (err) {
            setLoadingIsPayment(false);
            console.error("Error inicializando PaymentSheet:", err);
        }
    };

    return {
        showPaymentButton,
        loadingIsPayment,
        initializePaymentSheet,
        setShowPaymentButton
    };
};
