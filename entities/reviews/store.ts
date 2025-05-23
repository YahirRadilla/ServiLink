import { create } from "zustand";
import { TReview } from "./entity";


type ReviewState = {
    reviews: TReview[];
    featuredReview: TReview | null;
    setReviews: (reviews: TReview[]) => void;
    addReview: (review: TReview) => void;
    clearReviews: () => void;
    setFeaturedReview: (review: TReview | null) => void;
    clearFeaturedReview: () => void;
    totalReviews: number;
    setTotalReviews: (total: number) => void;
    shouldRefreshReviews: boolean;
    resetRefreshFlag: () => void;
    triggerRefresh: () => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
    reviews: [],
    featuredReview: null,
    totalReviews: 0,
    shouldRefreshReviews: false,

    setReviews: (reviews: TReview[]) => set({ reviews }),

    addReview: (review: TReview) =>
        set((state) => ({
            reviews: [...state.reviews, review],
        })),

    clearReviews: () => set({ reviews: [] }),

    setFeaturedReview: (review: TReview | null) => set({ featuredReview: review }),
    
    clearFeaturedReview: () => set({ featuredReview: null }),

    setTotalReviews: (total) => set({ totalReviews: total }),

    
    triggerRefresh: () => set({ shouldRefreshReviews: true }),
    resetRefreshFlag: () => set({ shouldRefreshReviews: false }),
}));
