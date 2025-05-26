import { useUserStore } from "@/entities/users";
import { db } from "@/lib/firebaseConfig";
import {
    useStripe
} from "@stripe/stripe-react-native";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";

const PaymentMethodsTab = () => {
    const [methods, setMethods] = useState<any[]>([]);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const user = useUserStore((state) => state.user);

    useEffect(() => {
        const fetchMethods = async () => {
            if (!user) return;
            const snap = await getDocs(
                collection(db, "customers", user.id, "payment_methods")
            );
            const loaded = snap.docs.map((doc) => doc.data());
            setMethods(loaded);
            console.log(loaded);
        };
        fetchMethods();
    }, []);

    const handleDelete = (id: string) => {
        Alert.alert("Eliminar", "¿Seguro que deseas eliminar este método?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                onPress: async () => {
                    if (!user) return;
                    await deleteDoc(doc(db, "customers", user.id, "payment_methods", id));
                    setMethods((prev) => prev.filter((m) => m.id !== id));
                },
                style: "destructive",
            },
        ]);
    };

    const handleAddCard = async () => {
        if (!user) return;

        const sessionRef = await addDoc(
            collection(db, "customers", user.id, "checkout_sessions"),
            {
                mode: "setup",
                client: "mobile",
            }
        );

        const unsubscribe = onSnapshot(sessionRef, async (snap) => {
            const data = snap.data();
            if (
                !data?.setupIntentClientSecret ||
                !data?.ephemeralKeySecret ||
                !data?.customer
            )
                return;

            const { error: initError } = await initPaymentSheet({
                merchantDisplayName: "ServiLink",
                customerId: data.customer,
                customerEphemeralKeySecret: data.ephemeralKeySecret,
                setupIntentClientSecret: data.setupIntentClientSecret,
            });


            if (initError) {
                console.error("Error inicializando PaymentSheet:", initError);
                return;
            }

            const { error: presentError } = await presentPaymentSheet();

            if (presentError) {
                Alert.alert("Error", presentError.message);
            } else {
                Alert.alert("Éxito", "Método de pago guardado con éxito");
                unsubscribe();
                const snap = await getDocs(
                    collection(db, "customers", user.id, "payment_methods")
                );
                setMethods(snap.docs.map((doc) => doc.data()));
            }
        });
    };

    return (
        <View className="flex-1 bg-primarybg-servilink px-4 pt-4">
            <Text className="text-white font-semibold text-lg mb-4">
                Tus métodos de pago
            </Text>
            <FlatList
                data={methods}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ backgroundColor: "#1A1A2F", padding: 16, borderRadius: 12, marginBottom: 12 }}>
                        <Text style={{ color: "white" }}>
                            {item.brand?.toUpperCase()} **** {item.last4} ({item.exp_month}/{item.exp_year})
                        </Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={{ color: "#aaa", textAlign: "center", marginTop: 40 }}>
                        No tienes métodos guardados.
                    </Text>
                }
                ListFooterComponent={
                    <Pressable
                        onPress={handleAddCard}
                        style={{ backgroundColor: "#3D5DC7", padding: 16, borderRadius: 10, marginTop: 20 }}
                    >
                        <Text style={{ color: "white", textAlign: "center" }}>Agregar nuevo método</Text>
                    </Pressable>
                }
            />


        </View>
    );
};

export default PaymentMethodsTab;
