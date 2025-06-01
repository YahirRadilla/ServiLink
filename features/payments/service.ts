import { auth, db } from '@/lib/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

export type TPayment = {
    id: string
    amount: number
    currency: string
    status: string
    createdAt: Date
    contractId: string
    method: string
}


export async function getPaymentsByCustomer() {
    const userId = auth.currentUser?.uid
    if (!userId) return []

    const paymentsRef = collection(db, `customers/${userId}/payments`)
    const snapshot = await getDocs(paymentsRef)

    return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
            id: doc.id,
            amount: data.amount,
            currency: data.currency,
            status: data.status,
            createdAt: new Date(data.created * 1000),
            contractId: data.metadata.contract_id,
            method: data.payment_method_types?.[0] || 'desconocido'
        }
    })
}