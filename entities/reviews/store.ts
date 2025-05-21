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
}

export const useReviewStore = create<ReviewState>((set) => ({
    reviews: [],
    featuredReview: null,

    setReviews: (reviews: TReview[]) => set({ reviews }),

    addReview: (review: TReview) =>
        set((state) => ({
            reviews: [...state.reviews, review],
        })),

    clearReviews: () => set({ reviews: [] }),

    setFeaturedReview: (review: TReview | null) => set({ featuredReview: review }),
    
    clearFeaturedReview: () => set({ featuredReview: null }),

    totalReviews: 0,
}));
