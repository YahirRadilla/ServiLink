// features/dashboard/useDashboard.ts

import { useEffect, useState } from "react";
import { fetchDashboardData } from "./service";

type DashboardData = {
    proposalsTotal: number;
    proposalsAccepted: number;
    proposalsRejected: number;
    proposalsPending: number;
    avgResponseTime: number;

    contractsActive: number;
    contractsFinished: number;
    avgOffersPerContract: number;

    totalReviews: number;
    avgRating: number;
    negativeReviews: number;

    totalSuccessfulPayments: number;
    totalRevenue: number;
    paymentsByCard: number;
    paymentsByLink: number;

    reviewsStats: { star: number; count: number }[];
};

export const useDashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const res = await fetchDashboardData();
            setData(res as DashboardData);
            setLoading(false);
        };

        loadData();
    }, []);

    return { data, loading };
};
