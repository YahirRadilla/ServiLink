import { create } from "zustand";
import { TReview } from "./entity";

type ReviewState = {
  reviews: TReview[];
  featuredReview: TReview | null;
  totalReviews: number;
  shouldRefreshReviews: boolean;
  removeReview: (id: string) => void;
  setReviews: (reviews: TReview[]) => void;
  addReview: (review: TReview) => void;
  clearReviews: () => void;
  setFeaturedReview: (review: TReview | null) => void;
  clearFeaturedReview: () => void;
  setTotalReviews: (total: number) => void;
  resetRefreshFlag: () => void;
  triggerRefresh: () => void;
};

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

  setFeaturedReview: (review: TReview | null) =>
    set({ featuredReview: review }),

  clearFeaturedReview: () => set({ featuredReview: null }),

  setTotalReviews: (total) => set({ totalReviews: total }),

  triggerRefresh: () => set({ shouldRefreshReviews: true }),
  resetRefreshFlag: () => set({ shouldRefreshReviews: false }),
  removeReview: (id: string) =>
    set((state) => {
      const newReviews = state.reviews.filter((r) => r.id !== id);
      const isFeaturedDeleted = state.featuredReview?.id === id;

      return {
        reviews: newReviews,
        featuredReview: isFeaturedDeleted ? null : state.featuredReview,
      };
    }),
}));
