import { TReview } from "@/entities/reviews";
import { useEffect, useState } from "react";
import { getPaginatedReviewsByPostId } from "./service";

export const usePaginatedReviewsByPostId = (postId: string) => {
  const [reviews, setReviews] = useState<TReview[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const { reviews: newReviews, last } = await getPaginatedReviewsByPostId(postId, lastDoc);

    const all = [...reviews, ...newReviews];
    const unique = all.filter(
      (review, index, self) => self.findIndex((r) => r.id === review.id) === index
    );

    setReviews(unique);
    setLastDoc(last);
    setHasMore(!!last);
    setLoading(false);
  };

  const refresh = async () => {
    setIsRefreshing(true);
    const { reviews: newReviews, last } = await getPaginatedReviewsByPostId(postId);

    setReviews(newReviews);
    setLastDoc(last);
    setHasMore(!!last);
    setIsRefreshing(false);
  };

  useEffect(() => {
    refresh();
  }, [postId]);

  return { reviews, loadMore, loading, hasMore, refresh, isRefreshing };
};
