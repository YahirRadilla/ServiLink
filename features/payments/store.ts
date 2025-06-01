
import { create } from 'zustand'
import { getPaymentsByCustomer, TPayment } from './service'

interface PaymentStore {
    payments: TPayment[]
    fetchPayments: () => Promise<void>
}

export const usePaymentStore = create<PaymentStore>((set) => ({
    payments: [],
    fetchPayments: async () => {
        const data = await getPaymentsByCustomer()
        set({ payments: data })
    }
}))
