import { TReview } from "@/entities/reviews";
import { useEffect, useState } from "react";
import { getFeaturedReviewByPostId, listenToReviewsByPostId } from "./service";


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