// dashboard/service.ts

import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const fetchDashboardData = async () => {
    const [proposalsSnap, contractsSnap, reviewsSnap, paymentsSnap] = await Promise.all([
        getDocs(collection(db, "proposals")),
        getDocs(collection(db, "contracts")),
        getDocs(collection(db, "reviews")),
        getDocs(collection(db, "payments")),
    ]);

    // Proposals
    const proposals = proposalsSnap.docs.map(doc => doc.data());
    const proposalsTotal = proposals.length;
    const proposalsAccepted = proposals.filter(p => p.accept_status === "accepted").length;
    const proposalsRejected = proposals.filter(p => p.accept_status === "rejected").length;
    const proposalsPending = proposals.filter(p => p.accept_status === "pending").length;

    const responseTimes: number[] = proposals.map(p => {
        const created = p.created_at?.toDate?.();
        const start = p.start_date?.toDate?.();
        return created && start ? (start.getTime() - created.getTime()) / (1000 * 60 * 60) : 0;
    }).filter(v => v > 0);
    const avgResponseTime = responseTimes.length ? responseTimes.reduce((a, b) => a + b) / responseTimes.length : 0;

    // Contracts
    const contracts = contractsSnap.docs.map(doc => doc.data());
    const contractsActive = contracts.filter(c => c.progress_status === "active").length;
    const contractsFinished = contracts.filter(c => c.progress_status === "finished").length;
    const avgOffersPerContract = contracts.length
        ? contracts.reduce((acc, c) => acc + (c.offers?.length || 0), 0) / contracts.length
        : 0;

    // Reviews
    const reviews = reviewsSnap.docs.map(doc => doc.data());
    const totalReviews = reviews.length;
    const avgRating = totalReviews ? reviews.reduce((sum, r) => sum + (r.valoration || 0), 0) / totalReviews : 0;
    const negativeReviews = reviews.filter(r => r.valoration < 3).length;

    // Payments
    const payments = paymentsSnap.docs.map(doc => doc.data());
    const successfulPayments = payments.filter(p => p.status === "succeeded");
    const totalSuccessfulPayments = successfulPayments.length;
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + (p.amount_received || 0), 0);
    const paymentsByCard = successfulPayments.filter(p => p.payment_method_types?.includes("card")).length;
    const paymentsByLink = successfulPayments.filter(p => p.payment_method_types?.includes("link")).length;


    const reviewsStats = [1, 2, 3, 4, 5].map(star => ({
        star,
        count: reviews.filter(r => r.valoration === star).length
    }));

    return {
        proposalsTotal,
        proposalsAccepted,
        proposalsRejected,
        proposalsPending,
        avgResponseTime,

        contractsActive,
        contractsFinished,
        avgOffersPerContract,

        totalReviews,
        avgRating,
        negativeReviews,

        totalSuccessfulPayments,
        totalRevenue,
        paymentsByCard,
        paymentsByLink,
        reviewsStats

    };
};
