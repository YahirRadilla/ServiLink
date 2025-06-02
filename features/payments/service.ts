import { auth, db } from '@/lib/firebaseConfig'
import { collectionGroup, getDocs } from 'firebase/firestore'

export type TPayment = {
    id: string
    amount: number
    currency: string
    status: string
    createdAt: Date
    contractId: string
    postId: string
    providerId: string
    clientId: string
    method: string
}


export async function getPaymentsByCustomer() {
    const uid = auth.currentUser?.uid
    if (!uid) return []

    const snapshot = await getDocs(collectionGroup(db, 'payments'))

    return snapshot.docs
        .map((doc) => {
            const data = doc.data()
            const metadata = data.metadata || {}

            return {
                id: doc.id,
                amount: data.amount,
                currency: data.currency,
                status: data.status,
                createdAt: new Date(data.created * 1000),
                contractId: metadata.contract_id,
                postId: metadata.post_id,
                providerId: metadata.provider_id,
                clientId: metadata.client_id,
                method: data.payment_method_types?.[0] || 'desconocido'
            }
        })
        .filter((p) => p.clientId === uid || p.providerId === uid)

}