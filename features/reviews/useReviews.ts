import { TReview } from "@/entities/reviews";
import { useUserStore } from "@/entities/users";
import { useEffect, useState } from "react";
import { createReview, getFeaturedReviewByPostId, listenToReviewsByPostId } from "./service";


export const useFeaturedReview = (postId: string) => {
    const [review, setReview] =useState<TReview | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!postId) return;

        setLoading(true);
        getFeaturedReviewByPostId(postId)
            .then(setReview)
            .finally(() => setLoading(false));
    }, [postId]);

    return { review, loading };
};

export const useLiveReviewsByPostId = (postId: string) => {
  const [reviews, setReviews] = useState<TReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const unsubscribe = listenToReviewsByPostId(
      postId,
      (newReviews: TReview[]) => {
        setReviews(newReviews);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [postId]);

  return { reviews, loading };
};

export const useReviews = () => {
  const [loadingReview, setLoading] = useState(false);

  const createNewReview = async (
    review: any,
    postId: string
  ): Promise<string | null> => {
    const user = useUserStore.getState().user;
    if (!user?.id) {
      console.warn("No hay usuario autenticado");
      return null;
    }

    try {
      setLoading(true);
      const id = await createReview(review, user.id, postId);
      return id;
    } catch (err) {
      console.error("🔥 Error en createNewReview:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loadingReview,
    createNewReview,
  };
};