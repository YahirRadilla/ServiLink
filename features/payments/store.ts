
import { create } from 'zustand'
import { getPaymentsByCustomer, TPayment } from './service'

interface PaymentStore {
    payments: TPayment[]
    fetchPayments: () => Promise<void>
    isLoading: boolean
}

export const usePaymentStore = create<PaymentStore>((set) => ({
    payments: [],
    isLoading: false,
    fetchPayments: async () => {
        set({ isLoading: true })
        const data = await getPaymentsByCustomer()
        set({ payments: data })
        set({ isLoading: false })
    }
}))
